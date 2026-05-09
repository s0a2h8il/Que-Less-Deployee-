import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Card } from "../../ui/Card";
import LocationPicker from "../../ui/LocationPicker";
import { Building2, MapPin, Phone, Mail, Clock, Map as MapIcon } from "lucide-react";

const CreateBusinessForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    areaName: initialData?.areaName || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    openingTime: initialData?.openingTime || "09:00",
    closingTime: initialData?.closingTime || "18:00",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (addr) => {
    setFormData((prev) => ({
      ...prev,
      addressLine1: addr.addressLine1 || prev.addressLine1,
      addressLine2: addr.addressLine2 || prev.addressLine2,
      areaName: addr.areaName || prev.areaName,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
      pincode: addr.pincode || prev.pincode,
    }));
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
    <Card className="max-w-4xl mx-auto p-6 sm:p-8 shadow-xl border-indigo-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <Building2 size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {initialData ? "Edit Business" : "Register Business"}
          </h2>
          <p className="text-slate-500">
            {initialData ? "Update your business details" : "Add your business to start creating queues"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Basic Info & Map */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={14} /> Basic Information
              </h3>
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
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="flex w-full rounded-2xl border-2 border-slate-200 bg-white/90 px-3.5 py-2 text-sm transition-all duration-500 ease-out outline-none hover:border-slate-300 hover:bg-white ring-2 ring-transparent ring-offset-2 ring-offset-white focus:border-[#0B1320] focus:bg-white focus:ring-[#0B1320] shadow-[0_8px_20px_rgba(61,64,91,0.04)] resize-none"
                  placeholder="Brief description of your services"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} /> Business Hours
              </h3>
              <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} /> Contact Details
              </h3>
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

          {/* Right Column: Map & Detailed Address */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MapIcon size={14} /> Business Location
              </h3>
              
              <div className="relative">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Pick Location from Map
                </label>
                <LocationPicker onAddressSelect={handleAddressSelect} />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  icon={MapPin}
                  placeholder="e.g. Building Name, Street"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  placeholder="e.g. Floor, Suite, Landmark"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Area / Neighborhood"
                    name="areaName"
                    placeholder="e.g. Downtown"
                    value={formData.areaName}
                    onChange={handleChange}
                  />
                  <Input
                    label="City"
                    name="city"
                    placeholder="e.g. New York"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="State"
                    name="state"
                    placeholder="e.g. NY"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <Input
                    label="Pincode / ZIP"
                    name="pincode"
                    placeholder="e.g. 10001"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 sm:flex-row sm:gap-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 text-base"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 h-12 text-base shadow-lg shadow-indigo-200" isLoading={loading}>
            {initialData ? "Save Changes" : "Register Business"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateBusinessForm;
