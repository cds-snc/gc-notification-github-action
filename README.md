# GC Notification GitHub Action
An action to send a message from a GitHub CI using GC Notify (or any other Notify fork).

## Usage

The action takes the following input parameters:

| Parameter | Description | Required | Default |
| --- | --- | --- | --- |
| api-key | The API key to use to send the message | true | |
| api-endpoint | The API endpoint to use to send the message | true | https://api.notification.canada.ca |
| message-type | The type of message to send. Can be `email` or `sms` | true | email |
| personalisation | The personalisation JSON to send with the message | true | `{}` |
| recipient | The recipient of the message (email address or phone number) | true | |
| reference | The reference string to use for the message | false | |
| template-id | The template ID to use for the message | true | |

### Examples

```yaml
- name: Send email
    uses: cds-snc/gc-notification-github-action@main
    with:
        api-key: ${{ secrets.GC_NOTIFY_API_KEY }}
        personalisation: '{"name": "John Doe"}'
        recipient: "test@test.com"
        template-id: "12345678-1234-1234-1234-123456789012"

- name: Send SMS
    uses: cds-snc/gc-notification-github-action@main
    with:
        api-key: ${{ secrets.GC_NOTIFY_API_KEY }}
        message-type: sms
        recipient: "5555555555"
        template-id: "12345678-1234-1234-1234-123456789012"
```

## Using it with another version of Notify

If you are using another version of Notify, you can specify the API endpoint to use with the `api-endpoint` parameter.

```yaml
- name: Send email through UK Notify
    uses: cds-snc/gc-notification-github-action@main
    with:
        api-key: ${{ secrets.GC_NOTIFY_API_KEY }}
        api-endpoint: https://api.notifications.service.gov.uk/
        personalisation: '{"name": "John Doe"}'
        recipient: "test@test.com"
        template-id: "12345678-1234-1234-1234-123456789012"
```

## LICENSE
MIT