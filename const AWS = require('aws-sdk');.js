const AWS = require('aws-sdk');
const uuid = require('uuid');
import fetch from 'node-fetch';

AWS.config.update({ region: 'us-east-1' }); // Puedes configurar la región aquí si es la misma para todos los servicios

const sqs = new AWS.SQS();

export const handler = async event => {
    const requestId = uuid.v4();
    const detail = event.detail.metadata['X-Shopify-Topic'];

    if (detail === 'app/uninstalled') {
        try {
            console.log(event);
            const response = await fetch('https://api.kayo3pl.com/shopify/unlinkAccount/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                },
                body: JSON.stringify({
                    message: 'La app ha sido desinstalada',
                    shopId: event.detail.payload.id,
                    shopName: event.detail.payload.name,
                }),
            });

            const data = await response.json();
            console.log('Respuesta de la API:', data);
        } catch (error) {
            console.error('Error al hacer el POST a la API:', error);
        }
    }
    const metadataClient = event?.detail?.metadata;
    if (metadataClient['X-Shopify-Shop-Domain'] === 'dptestdev.myshopify.com') {
        if (detail === 'fulfillment_orders/fulfillment_request_submitted') {
            try {
                console.log(`[${requestId}] Event:`, event);
                console.log(`[${requestId}] Payload OriginalFulfilment:`, event?.detail?.payload?.original_fulfillment_order);
                console.log(`[${requestId}] Payload submitted_fulfillment_order:`, event?.detail?.payload?.submitted_fulfillment_order);
                console.log(`[${requestId}] Payload fulfillment_order_merchant_request:`, event?.detail?.payload?.fulfillment_order_merchant_request);

                // Build the message for the SQS queue
                const messageBody = JSON.stringify(event);

                // Send the message to the SQS queue
                const params = {
                    QueueUrl: 'https://sqs.ca-central-1.amazonaws.com/890668259945/MainProcessingQueue.fifo', // Replace with your queue URL
                    MessageBody: messageBody,
                    MessageGroupId: 'default', // Adjust according to your needs
                    MessageDeduplicationId: requestId, // Use the unique request ID for deduplication
                };

                await sqs.sendMessage(params).promise();
                console.log(`[${requestId}] Message sent to SQS queue`);

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Webhook processed and message sent to queue',
                    }),
                };
            } catch (error) {
                console.error(`[${requestId}] Error sending message to SQS queue:`, error);

                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'Error processing the webhook',
                        error: error.message,
                    }),
                };
            }
        }
    } else {
        if (detail === 'fulfillment_orders/fulfillment_request_submitted') {
            try {
                console.log('Event', event);
                console.log('Payload OriginalFulfilment', event?.detail?.payload?.original_fulfillment_order);
                console.log('Payload submitted_fulfillment_order', event?.detail?.payload?.submitted_fulfillment_order);
                console.log('Payload fulfillment_order_merchant_request', event?.detail?.payload?.fulfillment_order_merchant_request);
                const response = await fetch('https://b7ec-142-115-250-28.ngrok-free.app/shopifyWebhook/fulfillment/request/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                    },
                    body: JSON.stringify({
                        event,
                    }),
                });

                const data = await response.json();
                console.log('Respuesta de la API:', data);
            } catch (error) {
                console.error('Error al hacer el POST a la API:', error);
            }
        }
    }

    if (detail === 'fulfillment_orders/cancelled') {
        try {
            const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/cancelled/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                },
                body: JSON.stringify({
                    event,
                }),
            });

            const data = await response.json();
            console.log('Respuesta de la API:', data);
        } catch (error) {
            console.error('Error al hacer el POST a la API:', error);
        }
    }

    if (detail === 'fulfillment_orders/split') {
        try {
            console.log('Event', event);
            const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/split/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                },
                body: JSON.stringify({
                    event,
                }),
            });

            const data = await response.json();
            console.log('Respuesta de la API:', data);
        } catch (error) {
            console.error('Error al hacer el POST a la API:', error);
        }
    }

    if (detail === 'fulfillment_orders/cancellation_request_submitted') {
        try {
            console.log('Event', event);
            const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/cancellation/request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                },
                body: JSON.stringify({
                    event,
                }),
            });

            const data = await response.json();
            console.log('Respuesta de la API:', data);
        } catch (error) {
            console.error('Error al hacer el POST a la API:', error);
        }
    }

    // if(detail === 'orders/edited'){
    //   try {
    //     const response = await fetch('https://api.kayo3pl.com/shopify/unlinkAccount/', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         "x-api-key": `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
    //       },
    //       body: JSON.stringify({
    //         message: 'La app ha sido desinstalada',
    //         shopId: event.detail.payload.id,
    //         shopName: event.detail.payload.name,
    //       }),
    //     });

    //     const data = await response.json();
    //     console.log('Respuesta de la API:', data);
    //   } catch (error) {
    //     console.error('Error al hacer el POST a la API:', error);
    //   }
    // }

    // if(detail === 'orders/updated'){
    //   try {
    //     const response = await fetch('https://api.kayo3pl.com/shopify/unlinkAccount/', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         "x-api-key": `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
    //       },
    //       body: JSON.stringify({
    //         message: 'La app ha sido desinstalada',
    //         shopId: event.detail.payload.id,
    //         shopName: event.detail.payload.name,
    //       }),
    //     });

    //     const data = await response.json();
    //     console.log('Respuesta de la API:', data);
    //   } catch (error) {
    //     console.error('Error al hacer el POST a la API:', error);
    //   }
    // }

    // Si el tipo de evento no coincide, devolver un 400
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Event type not supported',
        }),
    };
};
