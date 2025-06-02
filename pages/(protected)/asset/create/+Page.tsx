// File: pages/assets/create.jsx (atau sesuai struktur Vike Anda)
import React, { useState } from 'react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/assets', {
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
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Create New Asset</h1>
      
      {message && (
        <div className={`alert mb-4 ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Project Code</span>
          </label>
          <input
            type="text"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Asset No</span>
          </label>
          <input
            type="text"
            name="assetNo"
            value={formData.assetNo}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Line No</span>
          </label>
          <input
            type="text"
            name="lineNo"
            value={formData.lineNo}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Asset Name</span>
          </label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Location Description</span>
          </label>
          <input
            type="text"
            name="locationDesc"
            value={formData.locationDesc}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Condition</span>
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">PIS Date</span>
          </label>
          <input
            type="datetime-local"
            name="pisDate"
            value={formData.pisDate.slice(0, 16)}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Transaction Date</span>
          </label>
          <input
            type="datetime-local"
            name="transDate"
            value={formData.transDate.slice(0, 16)}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Category Code</span>
          </label>
          <input
            type="text"
            name="categoryCode"
            value={formData.categoryCode}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Adjusted Depreciation</span>
          </label>
          <input
            type="number"
            name="adjustedDepre"
            value={formData.adjustedDepre}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Acquisition Value (IDR)</span>
          </label>
          <input
            type="number"
            name="acqValueIdr"
            value={formData.acqValueIdr}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Acquisition Value</span>
          </label>
          <input
            type="number"
            name="acqValue"
            value={formData.acqValue}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Accumulated Depreciation</span>
          </label>
          <input
            type="number"
            name="accumDepre"
            value={formData.accumDepre}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">YTD Depreciation</span>
          </label>
          <input
            type="number"
            name="ytdDepre"
            value={formData.ytdDepre}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Book Value</span>
          </label>
          <input
            type="number"
            name="bookValue"
            value={formData.bookValue}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Create Asset
        </button>
      </form>
    </div>
  );
}

