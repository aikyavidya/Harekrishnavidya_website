"use client";
import { useState } from "react";
import { Mail, Phone, Globe, MapPin, Send, CheckCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image"
import logo from "../../public/images/logo.png";

type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
  terms: boolean;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
    terms: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const submitForm = async (formData: ContactFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://api.harekrishnavidya.org"}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: formData }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Form submission failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Submission failed (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      return result;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await submitForm(formData);
      setIsSubmitted(true);

      toast.success(
        "🙏 Thank you for your message! We will get back to you soon.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        terms: false,
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error: unknown) {
      let errorMessage = "Submission failed. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <ToastContainer />
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl text-black font-bold mb-4 tracking-tight">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-orange-400 max-w-3xl mx-auto leading-relaxed">
              We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond <br /> as soon as possible.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 -mt-8 relative z-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xs p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="flex justify-center items-center">
                  <Image src={logo} alt="logo" className="w-20 h-20 text-center" />

                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  HARE KRISHNA MOVEMENT INDIA
                </h2>
                <div className="flex items-start justify-center space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
                  <p className="text-center leading-relaxed">
                    Road No. 12, MLA Colony, Banjara Hills,
                    <br />
                    Hyderabad - 500034
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h3>

              <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a
                      href="mailto:connect2aikyavidya@gmail.com"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {/* aikyavidya@hkmhyderabad.org */}
                      aikyavidya@hkmhyderabad.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800">Phone</p>
                    <div className="flex flex-col lg:flex-row gap-1 lg:gap-6">
                      <a
                        href="https://wa.me/918121795663"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-green-600 hover:text-green-800 transition-colors"
                      >
                        81217 95663
                      </a>
                      <a
                        href="https://wa.me/918328389862"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-green-600 hover:text-green-800 transition-colors"
                      >
                        83283 89862
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Website</p>
                    <a
                      href="https://www.harekrishnavidya.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-900 hover:text-purple-950 transition-colors"
                    >
                      www.harekrishnavidya.org
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Send us a message
                  </h2>
                  <p className="text-gray-600">
                    We&apos;ll get back to you within 24 hours
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="+91 xxxxx xxxxx"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />

                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-700 leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link
                        href="/policies"
                        className="text-orange-600 hover:text-orange-800 font-medium underline"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/terms-conditions"
                        className="text-orange-600 hover:text-orange-800 font-medium underline"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitted}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitted ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Message Sent!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Need immediate assistance?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              For urgent inquiries or corporate/CSR related queries, please
              don&apos;t hesitate to call us directly or send an email.
              We&apos;re here to help you with any questions about our programs
              and services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+918121795663"
                className="inline-flex items-center px-6 py-3 border-2 border-black hover:border-orange-500 hover:bg-orange-500 text-black hover:text-white font-medium rounded-lg"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
              <a
                href="mailto:aikyavidya@hkmhyderabad.org"
                className="inline-flex items-center px-5 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
