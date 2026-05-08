import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { ListOrdered, Users, Timer } from "lucide-react";

const CreateQueueForm = ({ businesses, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    businessId: businesses[0]?._id || "",
    title: "",
    description: "",
    estimatedTimePerUser: 10,
    maxUsers: 50,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessId) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onCancel?.();
    } catch (err) {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-6 sm:p-8 shadow-xl border-indigo-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <ListOrdered size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Create New Queue
          </h2>
          <p className="text-slate-500">
            Set up a virtual queue for your business
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Select Business
          </label>
          <select
            name="businessId"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.businessId}
            onChange={handleChange}
            required
          >
            <option value="">Select a business</option>
            {businesses.map((biz) => (
              <option key={biz._id} value={biz._id}>
                {biz.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Queue Title"
          name="title"
          placeholder="e.g. Morning OPD / Main Counter"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Queue Description
          </label>
          <textarea
            name="description"
            rows="2"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            placeholder="What is this queue for?"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Est. Time (min/user)"
            name="estimatedTimePerUser"
            type="number"
            min="1"
            icon={Timer}
            value={formData.estimatedTimePerUser}
            onChange={handleChange}
            required
          />
          <Input
            label="Max Users"
            name="maxUsers"
            type="number"
            min="1"
            icon={Users}
            value={formData.maxUsers}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={loading}
            disabled={!formData.businessId}
          >
            Create Queue
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateQueueForm;
