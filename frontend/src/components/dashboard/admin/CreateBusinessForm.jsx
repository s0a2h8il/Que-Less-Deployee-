import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import { Building2, MapPin, Phone, Mail, Clock } from "lucide-react";

const CreateBusinessForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    openingTime: "09:00",
    closingTime: "18:00",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onCancel?.(); // Close form on success
    } catch (err) {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-8 shadow-xl border-indigo-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <Building2 size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Register Business</h2>
          <p className="text-slate-500">Add your business to start creating queues</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Business Name"
              name="name"
              placeholder="e.g. Health Center"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Category"
              name="category"
              placeholder="e.g. Medical"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                rows="3"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Brief description of your services"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Address"
              name="address"
              icon={MapPin}
              placeholder="123 Street Name"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              label="City"
              name="city"
              placeholder="e.g. New York"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="contact@business.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <Input
            label="Opening Time"
            name="openingTime"
            type="time"
            icon={Clock}
            value={formData.openingTime}
            onChange={handleChange}
            required
          />
          <Input
            label="Closing Time"
            name="closingTime"
            type="time"
            icon={Clock}
            value={formData.closingTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-4 pt-6">
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
          >
            Register Business
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateBusinessForm;
