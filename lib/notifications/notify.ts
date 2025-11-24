/**
 * Notification System
 *
 * Handles all notification channels: Email, SMS, Slack
 * Used throughout the automation system to alert on events
 */

export interface NotificationConfig {
  email?: EmailConfig;
  sms?: SMSConfig;
  slack?: SlackConfig;
}

export interface EmailConfig {
  service: 'sendgrid' | 'resend' | 'smtp';
  apiKey?: string;
  from: string;
  to: string | string[];
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
}

export interface SMSConfig {
  service: 'twilio';
  accountSid: string;
  authToken: string;
  from: string;
  to: string | string[];
}

export interface SlackConfig {
  webhookUrl: string;
  channel?: string;
}

export interface NotificationPayload {
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  tags?: string[];
  data?: Record<string, any>;
}

export type NotificationChannel = 'email' | 'sms' | 'slack' | 'all';

/**
 * Send notification through specified channel(s)
 */
export async function sendNotification(
  payload: NotificationPayload,
  channel: NotificationChannel = 'email',
  config?: NotificationConfig
): Promise<{ success: boolean; errors?: string[] }> {
  const errors: string[] = [];
  const results: boolean[] = [];

  try {
    // Determine which channels to use
    const channels: NotificationChannel[] =
      channel === 'all' ? ['email', 'sms', 'slack'] : [channel];

    // Send to each channel
    for (const ch of channels) {
      try {
        switch (ch) {
          case 'email':
            const emailResult = await sendEmail(payload, config?.email);
            results.push(emailResult);
            break;
          case 'sms':
            const smsResult = await sendSMS(payload, config?.sms);
            results.push(smsResult);
            break;
          case 'slack':
            const slackResult = await sendSlack(payload, config?.slack);
            results.push(slackResult);
            break;
        }
      } catch (error) {
        const errorMsg = `Failed to send ${ch} notification: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
        results.push(false);
      }
    }

    // Return success if at least one channel succeeded
    return {
      success: results.some(r => r),
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Notification system error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Send email notification
 */
async function sendEmail(
  payload: NotificationPayload,
  config?: EmailConfig
): Promise<boolean> {
  // Get config from environment if not provided
  const emailConfig: EmailConfig = config || {
    service: (process.env.EMAIL_SERVICE as 'sendgrid' | 'resend' | 'smtp') || 'smtp',
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@tlv-business-pulse.com',
    to: process.env.EMAIL_TO || 'admin@tlv-business-pulse.com',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
  };

  if (!emailConfig.from || !emailConfig.to) {
    console.warn('Email configuration incomplete, skipping email notification');
    return false;
  }

  const priorityEmoji = {
    low: 'ℹ️',
    normal: '📧',
    high: '⚠️',
    critical: '🚨',
  }[payload.priority];

  const emailBody = `
${priorityEmoji} ${payload.subject}

${payload.message}

---
Priority: ${payload.priority.toUpperCase()}
Timestamp: ${new Date().toISOString()}
${payload.tags ? `Tags: ${payload.tags.join(', ')}` : ''}

${payload.data ? `\nAdditional Data:\n${JSON.stringify(payload.data, null, 2)}` : ''}

---
TLV Business Pulse - Autonomous Operations
This is an automated notification from the TLV Business Pulse system.
  `.trim();

  try {
    if (emailConfig.service === 'sendgrid' && emailConfig.apiKey) {
      return await sendEmailViaSendGrid(emailConfig, payload.subject, emailBody);
    } else if (emailConfig.service === 'resend' && emailConfig.apiKey) {
      return await sendEmailViaResend(emailConfig, payload.subject, emailBody);
    } else {
      // Default to SMTP or log
      console.log('\n📧 EMAIL NOTIFICATION:');
      console.log('='.repeat(60));
      console.log(`To: ${emailConfig.to}`);
      console.log(`Subject: ${payload.subject}`);
      console.log('='.repeat(60));
      console.log(emailBody);
      console.log('='.repeat(60));
      return true;
    }
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

/**
 * Send email via SendGrid
 */
async function sendEmailViaSendGrid(
  config: EmailConfig,
  subject: string,
  body: string
): Promise<boolean> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: Array.isArray(config.to)
          ? config.to.map(email => ({ email }))
          : [{ email: config.to }],
      }],
      from: { email: config.from },
      subject,
      content: [{ type: 'text/plain', value: body }],
    }),
  });

  if (!response.ok) {
    throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
  }

  return true;
}

/**
 * Send email via Resend
 */
async function sendEmailViaResend(
  config: EmailConfig,
  subject: string,
  body: string
): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: Array.isArray(config.to) ? config.to : [config.to],
      subject,
      text: body,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend API error: ${response.status} ${response.statusText}`);
  }

  return true;
}

/**
 * Send SMS notification via Twilio
 */
async function sendSMS(
  payload: NotificationPayload,
  config?: SMSConfig
): Promise<boolean> {
  const smsConfig: SMSConfig = config || {
    service: 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    from: process.env.TWILIO_FROM || '',
    to: process.env.TWILIO_TO || '',
  };

  if (!smsConfig.accountSid || !smsConfig.authToken || !smsConfig.from || !smsConfig.to) {
    console.warn('SMS configuration incomplete, skipping SMS notification');
    return false;
  }

  // Only send SMS for high priority and critical messages
  if (payload.priority !== 'high' && payload.priority !== 'critical') {
    console.log('SMS skipped: priority not high enough');
    return true;
  }

  const smsMessage = `${payload.priority === 'critical' ? '🚨 CRITICAL: ' : '⚠️ ALERT: '}${payload.subject}\n${payload.message}`;

  try {
    const auth = Buffer.from(`${smsConfig.accountSid}:${smsConfig.authToken}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${smsConfig.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: smsConfig.from,
          To: Array.isArray(smsConfig.to) ? smsConfig.to[0] : smsConfig.to,
          Body: smsMessage.slice(0, 1600), // SMS character limit
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.status} ${response.statusText}`);
    }

    console.log('✅ SMS sent successfully');
    return true;
  } catch (error) {
    console.error('SMS send error:', error);
    throw error;
  }
}

/**
 * Send Slack notification
 */
async function sendSlack(
  payload: NotificationPayload,
  config?: SlackConfig
): Promise<boolean> {
  const slackConfig: SlackConfig = config || {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    channel: process.env.SLACK_CHANNEL,
  };

  if (!slackConfig.webhookUrl) {
    console.warn('Slack webhook URL not configured, skipping Slack notification');
    return false;
  }

  const colorMap = {
    low: '#36a64f',
    normal: '#2196F3',
    high: '#ff9800',
    critical: '#f44336',
  };

  try {
    const response = await fetch(slackConfig.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: slackConfig.channel,
        username: 'TLV Business Pulse',
        icon_emoji: ':robot_face:',
        attachments: [{
          color: colorMap[payload.priority],
          title: payload.subject,
          text: payload.message,
          fields: [
            {
              title: 'Priority',
              value: payload.priority.toUpperCase(),
              short: true,
            },
            {
              title: 'Timestamp',
              value: new Date().toISOString(),
              short: true,
            },
            ...(payload.tags ? [{
              title: 'Tags',
              value: payload.tags.join(', '),
              short: false,
            }] : []),
          ],
          footer: 'TLV Business Pulse Automation',
          ts: Math.floor(Date.now() / 1000),
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Slack notification sent successfully');
    return true;
  } catch (error) {
    console.error('Slack send error:', error);
    throw error;
  }
}

/**
 * Convenience functions for common notification types
 */

export async function notifyNewBusinessProcessed(
  businessName: string,
  success: boolean,
  details?: string
): Promise<void> {
  await sendNotification({
    subject: `New Business ${success ? 'Successfully Processed' : 'Processing Failed'}`,
    message: `Business: ${businessName}\nStatus: ${success ? 'Success' : 'Failed'}\n${details || ''}`,
    priority: success ? 'low' : 'high',
    tags: ['business-detection', success ? 'success' : 'failure'],
  }, 'email');
}

export async function notifyDailySummary(
  stats: {
    businessesProcessed: number;
    websitesGenerated: number;
    errors: number;
    successRate: number;
  }
): Promise<void> {
  await sendNotification({
    subject: `Daily Summary - ${new Date().toLocaleDateString()}`,
    message: `
Daily Operations Summary:
- Businesses Processed: ${stats.businessesProcessed}
- Websites Generated: ${stats.websitesGenerated}
- Errors: ${stats.errors}
- Success Rate: ${(stats.successRate * 100).toFixed(2)}%
    `.trim(),
    priority: stats.successRate < 0.9 ? 'high' : 'normal',
    tags: ['daily-summary'],
    data: stats,
  }, 'email');
}

export async function notifyCriticalError(
  system: string,
  error: string,
  context?: Record<string, any>
): Promise<void> {
  await sendNotification({
    subject: `Critical Error in ${system}`,
    message: `A critical error has occurred in ${system}:\n\n${error}`,
    priority: 'critical',
    tags: ['critical-error', system],
    data: context,
  }, 'all'); // Send to all channels for critical errors
}

export async function notifyHealthCheckFailed(
  failedServices: string[],
  details: string
): Promise<void> {
  await sendNotification({
    subject: 'Health Check Failed',
    message: `The following services are unhealthy:\n${failedServices.join('\n')}\n\n${details}`,
    priority: 'critical',
    tags: ['health-check', 'failure'],
  }, 'all');
}

export async function notifyWeeklyReport(report: string): Promise<void> {
  await sendNotification({
    subject: `Weekly Performance Report - Week of ${new Date().toLocaleDateString()}`,
    message: report,
    priority: 'normal',
    tags: ['weekly-report'],
  }, 'email');
}

export async function notifyMonthlyFinancialReport(report: string): Promise<void> {
  await sendNotification({
    subject: `Monthly Financial Report - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    message: report,
    priority: 'normal',
    tags: ['financial-report', 'monthly'],
  }, 'email');
}
