import ChainTrackingUI from '@/components/ChainTrackingUI';

export default function ChainOfCommandDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chain of Command - Legal Document Verification
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Track the cryptographic chain of custody for legal documents with full verification status.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Example: Arizona Superior Court Filing
          </h2>
          <p className="text-gray-600 mb-6">
            This demonstrates the Chain of Command verification for a court document.
          </p>

          {/* Example with a specific case */}
          <ChainTrackingUI
            tenantId="demo-tenant"
            caseId="CR2026-123456"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">1.</span>
                <span>Documents are uploaded and automatically hashed using SHA-256</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">2.</span>
                <span>Each event is cryptographically linked to the previous event</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">3.</span>
                <span>Chain state is periodically anchored to public blockchains</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">4.</span>
                <span>Full chain verification ensures tamper-evident records</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Verification Layers
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Evidence Layer</h4>
                  <p className="text-sm text-gray-600">Actual documents and files</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Chain of Command</h4>
                  <p className="text-sm text-gray-600">Cryptographically linked history</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Blockchain Anchor</h4>
                  <p className="text-sm text-gray-600">Public blockchain verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Ready to Verify Your Legal Documents?</h3>
          <p className="text-blue-100">
            Chain of Command provides tamper-evident verification for legal records,
            ensuring authenticity, integrity, and complete chain of custody tracking.
          </p>
        </div>
      </div>
    </div>
  );
}