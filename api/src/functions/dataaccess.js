const { app } = require('@azure/functions');

app.http('dataaccess', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // 外部APIのURL
        const externalUrl = 'https://prod-15.japaneast.logic.azure.com:443/workflows/90e36b66225f45dca07a6b134a3cb063/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ETuhs4vLTc41XTvg0hwxN_MqHlCy3yhM61bAzZL35Yw';

        try {
            // Logic Apps に渡す JSON body
            const body = {
                method: "select"
            };
            const response = await fetch(externalUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            return {
                status: 200,
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            };
        } catch (error) {
            return {
                status: 500,
                body: JSON.stringify({ error: error.message }),
                headers: { 'Content-Type': 'application/json' }
            };
        }
    }
});