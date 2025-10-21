export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const { NodeSDK } = await import('@opentelemetry/sdk-node');
            const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
            const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');

            const sdk = new NodeSDK({
                serviceName: process.env.OTEL_SERVICE_NAME || 'courtroom-game',
                traceExporter: new OTLPTraceExporter({
                    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
                }),
                instrumentations: [getNodeAutoInstrumentations()],
            });

            sdk.start();
            console.log('🔍 OpenTelemetry instrumentation started');
        } catch (error) {
            console.error('❌ Failed to start OpenTelemetry instrumentation:', error);
        }
    }
}