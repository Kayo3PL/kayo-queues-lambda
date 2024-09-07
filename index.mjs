import AWS from 'aws-sdk';
import fetch from 'node-fetch';

const sqs = new AWS.SQS();

export const handler = async event => {
    console.log('Event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);

        const detail = messageBody.detail.metadata['X-Shopify-Topic'];
        const metadataClient = messageBody.detail.metadata;
        const shopDomain = metadataClient['X-Shopify-Shop-Domain'];

        console.log('MESSAGE -----', messageBody);
        console.log('CLIENT -----', shopDomain);
        console.log('TOPIC -----', detail);

        try {
            switch (detail) {
                case 'app/uninstalled':
                    await fetch('https://api.kayo3pl.com/shopify/unlinkAccount/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                        },
                        body: JSON.stringify({
                            message: 'La app ha sido desinstalada',
                            shopId: messageBody.detail.payload.id,
                            shopName: messageBody.detail.payload.name,
                        }),
                    });
                    console.log('App uninstalled webhook processed');
                    break;

                case 'fulfillment_orders/fulfillment_request_submitted':
                    console.log('Processing fulfillment_orders/fulfillment_request_submitted webhook...');
                    try {
                        console.log('Entered the try-catch block');

                        // const response = await fetch('https://c5a2-2001-1970-5023-5d00-4d84-d107-67d1-575c.ngrok-free.app/shopifyWebhook/fulfillment/request/', {
                        const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/request/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                            },
                            body: JSON.stringify({ messageBody }),
                        });

                        console.log('Fetch response status:', response.status);

                        // Leer la respuesta (cambiar a response.text() si es necesario)
                        const responseBody = await response.json();
                        console.log('Fetch response body:', responseBody);

                        if (!response.ok || !responseBody.data?.success) {
                            console.error(`Failed to process webhook, status: ${response.status}, message: ${responseBody.message} message2: ${responseBody?.data?.message}`);
                            await sendMessageToRetryQueue(record);
                        } else {
                            console.log('Fulfillment request webhook processed successfully.');
                        }
                    } catch (fetchError) {
                        console.error('Error making fetch request:', fetchError);
                        await sendMessageToRetryQueue(record); // Manda a la cola de reintentos en caso de excepción
                    }
                    break;

                case 'fulfillment_orders/cancelled':
                    try {
                        console.log('Entered the try-catch block Order Cancelled');

                        // const response = await fetch('https://89b9-2001-1970-5023-5d00-a054-b2a7-e3d8-76a8.ngrok-free.app/shopifyWebhook/fulfillment/cancelled/', {
                        const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/cancelled/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                            },
                            body: JSON.stringify({ messageBody }),
                        });

                        console.log('Fetch response status:', response.status);

                        // Leer la respuesta (cambiar a response.text() si es necesario)
                        const responseBody = await response.json();
                        console.log('Fetch response body:', responseBody);

                        if (!response.ok || !responseBody.data?.success) {
                            console.error(`Failed to process webhook, status: ${response.status}, message: ${responseBody.message} message2: ${responseBody?.data?.message}`);
                            await sendMessageToRetryQueue(record);
                        } else {
                            console.log('Fulfillment request webhook cancelled successfully.');
                        }
                    } catch (fetchError) {
                        console.error('Error making fetch request:', fetchError);
                        await sendMessageToRetryQueue(record); // Manda a la cola de reintentos en caso de excepción
                    }
                    break;

                case 'fulfillment_orders/split':
                    try {
                        console.log('Entered the try-catch block Order Split');

                        // const response = await fetch('https://c5a2-2001-1970-5023-5d00-4d84-d107-67d1-575c.ngrok-free.app/shopifyWebhook/fulfillment/split/', {
                        const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/split/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                            },
                            body: JSON.stringify({ messageBody }),
                        });

                        console.log('Fetch response status:', response.status);

                        // Leer la respuesta (cambiar a response.text() si es necesario)
                        const responseBody = await response.json();
                        console.log('Fetch response body:', responseBody);

                        if (!response.ok || !responseBody.data?.success) {
                            console.error(`Failed to process webhook, status: ${response.status}, message: ${responseBody.message} message2: ${responseBody?.data?.message}`);
                            await sendMessageToRetryQueue(record);
                        } else {
                            console.log('Fulfillment request webhook cancelled successfully.');
                        }
                    } catch (fetchError) {
                        console.error('Error making fetch request:', fetchError);
                        await sendMessageToRetryQueue(record); // Manda a la cola de reintentos en caso de excepción
                    }
                    break;

                case 'fulfillment_orders/cancellation_request_submitted':
                    try {
                        console.log('Entered the try-catch block Order Cancelled request');

                        // const response = await fetch('https://c5a2-2001-1970-5023-5d00-4d84-d107-67d1-575c.ngrok-free.app/shopifyWebhook/fulfillment/cancellation/request/', {
                        const response = await fetch('https://api.kayo3pl.com/shopifyWebhook/fulfillment/cancellation/request/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': `pk_o3PVZEywhzNN2VGiXMhBf9xslEVYeT8Ss25`,
                            },
                            body: JSON.stringify({ messageBody }),
                        });

                        console.log('Fetch response status:', response.status);

                        // Leer la respuesta (cambiar a response.text() si es necesario)
                        const responseBody = await response.json();
                        console.log('Fetch response body:', responseBody);

                        if (!response.ok || !responseBody.data?.success) {
                            console.error(`Failed to process webhook, status: ${response.status}, message: ${responseBody.message} message2: ${responseBody?.data?.message}`);
                            await sendMessageToRetryQueue(record);
                        } else {
                            console.log('Fulfillment request webhook cancelled successfully.');
                        }
                    } catch (fetchError) {
                        console.error('Error making fetch request:', fetchError);
                        await sendMessageToRetryQueue(record); // Manda a la cola de reintentos en caso de excepción
                    }
                    break;
                // Agrega más casos según sea necesario
                default:
                    console.log(`Unhandled topic: ${detail}`);
                    break;
            }

            // Elimina el mensaje de la cola si se procesó correctamente

            console.log('Attempting to delete message from queue...');
            await deleteMessageFromQueue(record.receiptHandle);
            console.log('Message deleted from queue successfully.');
        } catch (error) {
            console.error('Error processing message:', error);
            await sendMessageToRetryQueue(record);
        }
    }
};

const deleteMessageFromQueue = async receiptHandle => {
    console.log('Deleting message with receipt handle:', receiptHandle);
    const params = {
        QueueUrl: 'https://sqs.ca-central-1.amazonaws.com/890668259945/MainProcessingQueue.fifo',
        ReceiptHandle: receiptHandle,
    };
    await sqs.deleteMessage(params).promise();
    console.log('Message deletion successful.');
};

const sendMessageToRetryQueue = async record => {
    console.log('Sending message to retry queue...');
    const params = {
        QueueUrl: 'https://sqs.ca-central-1.amazonaws.com/890668259945/RetryProcessingQueue.fifo',
        MessageBody: record.body,
        MessageGroupId: 'default',
        MessageDeduplicationId: record.messageId,
    };
    await sqs.sendMessage(params).promise();
    console.log('Message sent to retry queue.');
};
