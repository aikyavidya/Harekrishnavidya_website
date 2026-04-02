"use client";

export default function RefundPolicy() {
  return (
    <div className="lg:max-w-7xl mx-auto px-4 py-10 text-gray-800 space-y-6">
      <h1 className="text-3xl lg:text-5xl font-bold text-[#0F3D64] text-center lg:py-10  mb-6">
        Refund Policy
      </h1>

      <p className="text-base text-justify">
        HARE KRISHNA MOVEMENT INDIA INDIA follow a reliable refund policy to let our
        donors feel privileged about their association with us. We take utmost
        care about processing donations as per the mandates signed by our donors
        in the donor forms, both offline and online. But in case of an unlikely
        event of an erroneous deduction or if the donor wants to cancel/deduct
        the donation, we will respond within 7 working days from the date of
        receiving the complaint from donor and we will refund with in 7 to 14
        Working days. The timely refund of the wrongly deduced amount will
        depend on type of card used during transaction. We would require a proof
        of deduction of the donation amount and a written communication for
        refund from the donor within two days after donation.
      </p>

      <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
        <li>
          In such cases if the receipt already has been issued, then the donor
          needs to return the original receipt at our official address.
        </li>
        <li>
          In the case of tax exemption certificate already issued, refund will
          not be possible.
        </li>
      </ul>

      <div className="flex items-center gap-2 w-fit bg-gray-100 rounded-full shadow-lg px-4 py-2 text-gray-800">
        <span className="text-red-600 text-lg font-bold shrink-0">
          ⚠️ Note:
        </span>
        <span className="text-gray-950 font-bold">
          <span className="hidden md:inline">
            Please note that international donations will require more working
            days for refund.
          </span>
          <span className="md:hidden">
            International donations require more days for refund.
          </span>
        </span>
      </div>
    </div>
  );
}
