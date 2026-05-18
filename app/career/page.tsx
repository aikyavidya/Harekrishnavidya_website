"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  qualification: string;
  experience: string;
  city: string;
  heardFrom: string;
  message: string;
  cv: File | null;
  website: string; // Honeypot field
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  position: "",
  gender: "",
  qualification: "",
  experience: "",
  city: "",
  heardFrom: "",
  message: "",
  cv: null,
  website: "",
};

export default function CareerPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (values: FormState): FormErrors => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!values.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else {
      const digitsOnly = values.phone.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        newErrors.phone = "Enter a valid 10-digit mobile number.";
      }
    }

    if (!values.position.trim()) {
      newErrors.position = "Position is required.";
    }

    if (!values.gender.trim()) {
      newErrors.gender = "Gender selection is required.";
    }

    if (!values.qualification.trim()) {
      newErrors.qualification = "Highest qualification is required.";
    }

    if (!values.experience.trim()) {
      newErrors.experience = "Experience is required.";
    } else if (!/^[0-9]+(\.[0-9]+)?$/.test(values.experience)) {
      newErrors.experience = "Enter experience in years (only numbers).";
    }

    if (!values.city.trim()) {
      newErrors.city = "Current city is required.";
    }

    if (!values.heardFrom.trim()) {
      newErrors.heardFrom = "Please tell us how you heard about us.";
    }

    if (!values.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (values.message.trim().length < 20) {
      newErrors.message = "Message should be at least 20 characters.";
    }

    if (!values.cv) {
      newErrors.cv = "Please upload your CV as a PDF file.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("position", form.position);
        formData.append("gender", form.gender);
        formData.append("qualification", form.qualification);
        formData.append("experience", form.experience);
        formData.append("city", form.city);
        formData.append("heardFrom", form.heardFrom);
        formData.append("message", form.message);
        if (form.cv) {
          formData.append("cv", form.cv);
        }
        formData.append("website", form.website);

        const res = await fetch(
          // process.env.NEXT_PUBLIC_CAREER_API_URL ||
          // "https://api.harekrishnavidya.org/api/career/apply",
          "/api/career",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Failed to submit application.");
        }

        setSubmitted(true);
        setForm(initialState);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setServerError(message);
        setSubmitted(false);
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for phone: allow only digits and max 10 characters
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, phone: onlyDigits }));
      setErrors((prev) => ({ ...prev, phone: "" }));
      return;
    }

    // Special handling for CV upload
    if (name === "cv") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;

      if (file && file.type !== "application/pdf") {
        setForm((prev) => ({ ...prev, cv: null }));
        setErrors((prev) => ({
          ...prev,
          cv: "Only PDF files are allowed.",
        }));
        return;
      }

      setForm((prev) => ({ ...prev, cv: file }));
      setErrors((prev) => ({ ...prev, cv: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F5FAFF] via-white to-[#FFF8EF]">
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-12 space-y-8">
        {/* Page heading */}
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-white/80 border border-[#1C398E]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C398E] shadow-sm">
            Career &amp; Seva Opportunities
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#002A42]">
            Join Our Team
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Share your skills and help us serve children and communities with
            value-based education and care.
          </p>
          <div className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-[#F4A261] via-[#F4A261] to-[#1C398E]" />
        </div>

        {/* Benefits section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="rounded-xl bg-gradient-to-br from-white to-[#FFF4E6] shadow-sm border border-orange-100 p-4">
            <h2 className="text-sm font-semibold text-[#002A42] mb-2">
              Spiritual Environment
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Serve in a devotional atmosphere and grow personally and
              spiritually.
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-white to-[#E9F2FF] shadow-sm border border-blue-100 p-4">
            <h2 className="text-sm font-semibold text-[#002A42] mb-2">
              Real Social Impact
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Contribute directly to the education and value formation of
              underprivileged children, creating long-term change in rural
              communities.
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-white to-[#FDF2FF] shadow-sm border border-purple-100 p-4">
            <h2 className="text-sm font-semibold text-[#002A42] mb-2">
              Flexible Opportunities
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Opportunities for teachers, coordinators, content creators,
              volunteers and professionals across different skill sets and time
              commitments.
            </p>
          </div>
        </section>

        {/* Current openings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-bold text-[#002A42]">
              Current Openings
            </h2>
            <p className="text-[11px] md:text-xs text-gray-500">
              If you don&apos;t see a perfect match, you can still share your
              interest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="rounded-xl bg-white shadow-sm border-l-4 border-[#1C398E] p-4">
              <h3 className="text-sm font-semibold text-[#002A42]">
                Field Teacher / Facilitator
              </h3>
              <p className="mt-1 text-xs md:text-sm text-gray-600">
                Teach and guide children in rural schools and learning centers.
              </p>
              <p className="mt-2 text-[11px] text-gray-500">
                Rural Telangana & Andhra Pradesh
              </p>
            </div>
            <div className="rounded-xl bg-white shadow-sm border-l-4 border-[#F4A261] p-4">
              <h3 className="text-sm font-semibold text-[#002A42]">
                Volunteer / Admin Support
              </h3>
              <p className="mt-1 text-xs md:text-sm text-gray-600">
                Help with coordination, communication and basic administration.
              </p>
              <p className="mt-2 text-[11px] text-gray-500">
                Hyderabad & Hybrid options
              </p>
            </div>
          </div>
        </section>

        {/* Form card */}
        <div className="rounded-2xl bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.10)] border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r  from-[#1C398E] via-[#1C398E] to-[#F4A261] px-6 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                Apply Now
              </p>
              <p className="text-sm font-semibold text-white">
                Share your details and our team will connect with you.
              </p>
            </div>
          </div>

          <div className="px-4 py-5 md:px-7 md:py-7 lg:px-9 lg:py-8 max-w-6xl mx-auto ">
            {submitted && (
              <div className="mb-6 rounded-md border border-green-400  px-4 py-3 text-sm text-green-800">
                Thank you for your interest. Your application has been submitted
                successfully.
              </div>
            )}

            {serverError && (
              <div className="mb-6 rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-800">
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6 p-6 md:p-7 rounded-xl border border-[#1C398E]/10"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={10}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="+91 00000 00000"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.gender ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="qualification"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Highest Qualification<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.qualification ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="">Select qualification</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.qualification && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.qualification}
                    </p>
                  )}
                </div>
              </div>

              {/* CV Upload */}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Position / Area of Service
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={form.position}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.position ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="e.g. Teacher, Volunteer Coordinator, Content Writer"
                  />
                  {errors.position && (
                    <p className="mt-1 text-xs text-red-500">{errors.position}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Experience (in years)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    value={form.experience}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.experience ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="e.g. 0, 1, 3.5"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.experience}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current City<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="heardFrom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    How did you hear about us?
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="heardFrom"
                    name="heardFrom"
                    value={form.heardFrom}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.heardFrom ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Temple Announcement">Temple Announcement</option>
                    <option value="Friend or Family">Friend or Family</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Website">Website</option>
                    <option value="Event">Event / Program</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.heardFrom && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.heardFrom}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tell us about yourself & your motivation
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1C398E] ${errors.message ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Share your background, experience, and why you would like to serve with Hare Krishna Vidya."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="cv"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Upload CV (PDF)<span className="text-red-500">*</span>
                </label>
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#1C398E] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#142a68] cursor-pointer"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Please upload your latest CV in PDF format.
                </p>
                {errors.cv && (
                  <p className="mt-1 text-xs text-red-500">{errors.cv}</p>
                )}
              </div>
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3 justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center cursor-pointer justify-center rounded-sm bg-[#1C398E] px-7 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#142a68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C398E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>

                {/* Honeypot field - hidden from users */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                {/* <p className="text-[11px] md:text-xs text-gray-500">
                We will reach out to you on the contact details you have shared.
              </p> */}
              </div>

            </form>
          </div>
        </div>
      </section>
    </main>
  );
}


