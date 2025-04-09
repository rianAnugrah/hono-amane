// File: pages/assets/create.jsx (atau sesuai struktur Vike Anda)
import { useState } from 'react';

export default function AssetCreatePage() {
  const [formData, setFormData] = useState({
    projectCode: 'PRJ001',
    assetNo: 'AST001',
    lineNo: 'LN001',
    assetName: '',
    locationDesc: '',
    condition: 'Good',
    pisDate: '2025-01-01T00:00:00Z',
    transDate: '2025-01-01T00:00:00Z',
    categoryCode: 'CAT001',
    adjustedDepre: 0,
    acqValueIdr: 0,
    acqValue: 0,
    accumDepre: 0,
    ytdDepre: 0,
    bookValue: 0
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Asset successfully created!');
        // Optional: Reset form
        setFormData({
          projectCode: 'PRJ001',
          assetNo: 'AST001',
          lineNo: 'LN001',
          assetName: '',
          locationDesc: '',
          condition: 'Good',
          pisDate: '2025-01-01T00:00:00Z',
          transDate: '2025-01-01T00:00:00Z',
          categoryCode: 'CAT001',
          adjustedDepre: 0,
          acqValueIdr: 0,
          acqValue: 0,
          accumDepre: 0,
          ytdDepre: 0,
          bookValue: 0
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to create asset'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Asset</h1>
      
      {message && (
        <div className={`mb-4 p-2 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Project Code</label>
          <input
            type="text"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Asset No</label>
          <input
            type="text"
            name="assetNo"
            value={formData.assetNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Line No</label>
          <input
            type="text"
            name="lineNo"
            value={formData.lineNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Asset Name</label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Location Description</label>
          <input
            type="text"
            name="locationDesc"
            value={formData.locationDesc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block">PIS Date</label>
          <input
            type="datetime-local"
            name="pisDate"
            value={formData.pisDate.slice(0, 16)}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Transaction Date</label>
          <input
            type="datetime-local"
            name="transDate"
            value={formData.transDate.slice(0, 16)}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Category Code</label>
          <input
            type="text"
            name="categoryCode"
            value={formData.categoryCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Adjusted Depreciation</label>
          <input
            type="number"
            name="adjustedDepre"
            value={formData.adjustedDepre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Acquisition Value (IDR)</label>
          <input
            type="number"
            name="acqValueIdr"
            value={formData.acqValueIdr}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Acquisition Value</label>
          <input
            type="number"
            name="acqValue"
            value={formData.acqValue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Accumulated Depreciation</label>
          <input
            type="number"
            name="accumDepre"
            value={formData.accumDepre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">YTD Depreciation</label>
          <input
            type="number"
            name="ytdDepre"
            value={formData.ytdDepre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block">Book Value</label>
          <input
            type="number"
            name="bookValue"
            value={formData.bookValue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Asset
        </button>
      </form>
    </div>
  );
}

