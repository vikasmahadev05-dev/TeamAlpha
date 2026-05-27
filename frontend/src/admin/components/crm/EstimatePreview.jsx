import React, { forwardRef } from 'react';
import { numberToIndianWords } from '../../utils/numberToWords';
import new_logo from "../../../assets/new_logo_original.png";
import engagementImg from "../../../assets/covers/engagement.png";

const EstimatePreview = forwardRef(({ data }, ref) => {
     // A4 proportions: 794 x 1123 px at 96 DPI
    const pageStyle = "w-[794px] h-[1123px] bg-white relative mx-auto shrink-0 shadow-sm border border-stone-100 mt-4 overflow-hidden text-[#1A1A1A] font-sans box-border";

    // Total from events
    const eventsTotal = data.events?.reduce((sum, ev) => sum + (Number(ev.price) || 0), 0) || 0;

    const deliverablesList = Array.isArray(data.deliverables) ? data.deliverables : (data.deliverables || "").split('\n').filter(l => l.trim() !== '');
    const timelineList = data.timeline || [
        { deliverable: "Soft Copies (All photos)", time: "7 Days" },
        { deliverable: "Candid Photographs", time: "45 days" },
        { deliverable: "Cinematography Video", time: "60 days" },
        { deliverable: "Edited Traditional Video", time: "60 days" }
    ];

    // Use the imported engagement image as the universal fallback cover image
    const isInvalidCover = !data.coverImage || data.coverImage === "/new_logo_origin.png";
    const coverImageUrl = isInvalidCover ? engagementImg : data.coverImage;

    return (
        <div ref={ref} className="bg-transparent p-8 pt-0 flex flex-col gap-12 items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* PAGE 1: REFINED COVER - NO OVERLAPS */}
            <div className={pageStyle + " pdf-page flex flex-col items-center pt-10"}>
                {/* Minimalist Top Branding */}
                <div className="text-center mb-8">
                    <p className="text-[10px] tracking-[0.5em] text-stone-400 uppercase mb-2">Wedding Photography Portfolio</p>
                    <div className="w-12 h-[1px] bg-stone-200 mx-auto"></div>
                </div>

                {/* Primary Logo - Centered */}
                <div className="flex flex-col items-center mb-10 px-4">
                    <img
                        src={new_logo}
                        alt="Team Alpha Logo"
                        style={{
                            width: "180px",
                            height: "auto",
                            objectFit: "contain"
                        }}
                    />
                    <div className="mt-[-15px] text-center">
                        <h1 className="text-2xl font-bold tracking-[0.2em] text-[#1A1A1A] font-serif uppercase">TEAM ALPHA</h1>
                        <p className="text-[8px] tracking-[0.6em] text-stone-400 uppercase mt-1 italic">THE WEDDING ARTIST</p>
                    </div>
                </div>

                {/* Centered Image Frame - Avoids Side-Text Collision */}
                <div className="w-[85%] h-[420px] border-[10px] border-stone-50 shadow-2xl relative overflow-hidden rounded-sm">
                    <img 
                        src={coverImageUrl} 
                        alt="Wedding" 
                        className="w-full h-full object-cover grayscale-[0.1]" 
                        crossOrigin="anonymous" 
                    />
                </div>

                {/* Central Statement - Perfectly Aligned */}
                <div className="mt-16 text-center max-w-[600px] px-8">
                    <h2 className="text-[34px] font-serif italic text-stone-800 leading-tight tracking-[0.02em]">
                        "Capturing your forever, one timeless memory at a time."
                    </h2>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <div className="h-[1px] w-8 bg-stone-300"></div>
                        <p className="text-[11px] tracking-[0.3em] font-medium text-stone-400 uppercase">OFFICIAL PROPOSAL</p>
                        <div className="h-[1px] w-8 bg-stone-300"></div>
                    </div>
                </div>

                {/* Bottom Contact Detail */}
                <div className="absolute bottom-12 text-center w-full border-t border-stone-50 pt-8">
                    <p className="text-[10px] tracking-[0.4em] text-stone-400 uppercase">
                        +91 91106 03953  •  info@teamalphacrew.com
                    </p>
                </div>
            </div>

            {/* PAGE 2: WELCOME & WORKFLOW */}
            <div className={pageStyle + " pdf-page px-20 py-28"}>
                <div className="mb-16">
                    <h3 className="text-4xl font-serif italic text-stone-900 mb-6">Congratulations</h3>
                    <p className="text-stone-500 text-[13px] leading-relaxed max-w-[450px]">
                        Thank you for considering us to be part of your legacy. It’s an honor to capture the moments you’ll cherish for decades to come. Our team is committed to excellence and storytelling of the highest caliber.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                     {/* Timeline Table */}
                    <div className="bg-stone-50 p-10 rounded-sm">
                        <h4 className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase mb-8">Post-Production Timeline</h4>
                        <table className="w-full text-left text-[12px]">
                            <tbody className="divide-y divide-stone-200">
                                {timelineList.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-4 font-bold text-stone-900 pr-4">{item.deliverable}</td>
                                        <td className="py-4 text-stone-500 text-right italic">{item.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Workflow */}
                    <div className="px-4">
                        <h4 className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase mb-8">Service Workflow</h4>
                        <div className="space-y-6 text-[12px] text-stone-600">
                            {[
                                "Payment confirmation with 50% advance.",
                                "Project confirmation with other vendors & finalize deliverables with 25% payment.",
                                "Shoot day data will be updated on drive & download link will be sent.",
                                "Selection of photos & videos from client.",
                                "Delivery of albums & collection of remaining payment."
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <span className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-[10px] text-stone-400">{i+1}</span>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 3: INVESTMENT DETAILS */}
            <div className={pageStyle + " pdf-page px-16 py-24"}>
                <div className="text-center mb-16">
                    <p className="text-[10px] tracking-[0.4em] text-stone-400 uppercase mb-2">Detailed Investment</p>
                    <h3 className="text-3xl font-serif italic text-stone-900">Project Sessions & Fees</h3>
                </div>

                <div className="border border-stone-100 rounded-sm overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                        <thead className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            <tr>
                                <th className="p-6 text-left border-r border-stone-100">Event / Context</th>
                                <th className="p-6 text-left border-r border-stone-100">Inclusions</th>
                                <th className="p-6 text-right">Investment</th>
                            </tr>
                        </thead>
                        <tbody className="text-[12px] text-stone-800">
                             {data.events?.map((ev, i) => (
                                <tr key={i} className="border-t border-stone-100">
                                    <td className="p-6 border-r border-stone-100 align-top">
                                        <div className="font-bold mb-1">{ev.eventName}</div>
                                        <div className="text-[10px] text-stone-400 uppercase tracking-widest">{ev.dateLocation}</div>
                                    </td>
                                    <td className="p-6 border-r border-stone-100 align-top leading-relaxed text-stone-500">
                                        {ev.services}
                                    </td>
                                    <td className="p-6 text-right font-bold align-top whitespace-nowrap">
                                        ₹ {Number(ev.price).toLocaleString('en-IN')}/-
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                        <tfoot className="bg-[#1A1A1A] text-white">
                            <tr>
                                <td colSpan="2" className="p-6 font-bold text-sm tracking-widest uppercase">Base Total Investment</td>
                                <td className="p-6 text-right font-bold text-lg whitespace-nowrap">₹ {eventsTotal.toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <p className="mt-4 text-[10px] text-stone-400 italic text-right px-2">
                    {numberToIndianWords(eventsTotal)} Only
                </p>
            </div>

            {/* PAGE 4: ASSETS & SUMMARY */}
            <div className={pageStyle + " pdf-page px-20 py-28 flex flex-col"}>
                <div className="mb-20">
                     <h3 className="text-[10px] tracking-[0.4em] text-stone-400 uppercase mb-8">Deliverables Checklist</h3>
                     <div className="grid grid-cols-1 gap-4">
                         {deliverablesList.map((d, i) => (
                            <div key={i} className="flex items-center gap-4 py-3 border-b border-stone-100 text-[13px] text-stone-700">
                                 <span className="w-1.5 h-1.5 bg-stone-900"></span>
                                 {d}
                            </div>
                         ))}
                     </div>
                </div>

                <div className="mt-auto bg-stone-50 p-12 text-center rounded-sm">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.5em] mb-4">Total Value of Services</p>
                    <h2 className="text-4xl font-serif text-stone-900 mb-2">₹ {(data.total || 0).toLocaleString('en-IN')}.00</h2>
                    <p className="text-[11px] italic text-stone-500">{numberToIndianWords(data.total || 0)}</p>
                </div>

                <div className="mt-20 pt-10 border-t border-stone-100 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">Equipped with Pro Sony Cinema Series & GM Prime Lenses</p>
                </div>
            </div>

            {/* PAGE 5: TERMS & CONDITIONS */}
            <div className={pageStyle + " pdf-page px-20 py-24 flex flex-col justify-between"}>
                <div>
                    <h3 className="text-[18px] font-bold text-[#1A1A1A] uppercase mb-4">TERMS & CONDITIONS</h3>
                    <p className="text-[13px] font-bold text-red-600 leading-relaxed mb-10 pr-4">
                        We kindly ask you to review our Terms & Conditions carefully before making an advance payment. By completing the payment, you confirm your understanding and acceptance of these terms, helping us serve you better.
                    </p>

                    <div className="space-y-6 text-[12px] text-stone-600 leading-relaxed pl-4">
                        <div className="relative">
                            <span className="absolute -left-4 top-0 font-bold">•</span>
                            <span className="font-bold text-[#1A1A1A]">BOOKING CONFIRMATION AND PAYMENTS: </span>
                            To confirm booking for our photography, videography, and other services, you are requested to pay an advance amount of 50% of the total project cost plus the traveling charges (if any). We follow a strict "first come first serve" policy. Without the advance payment, we cannot guarantee to block specific dates for you. The remaining balance of the total amount can be paid prior to the 1st day of the photo shoot or preferably two days in advance. We accept cash, cheque, and online transfer. We will share the transaction details once you confirm to us your preferred mode of payment.
                        </div>

                        <div className="relative">
                            <span className="absolute -left-4 top-0 font-bold">•</span>
                            <span className="font-bold text-[#1A1A1A]">CANCELLATIONS AND RESCHEDULING: </span>
                            Client will be responsible for payment of all expenses incurred up to the time of cancellation of the assignment, plus 50 percent of Photographer's fee. However, if notice of cancellation is given less than two (2) business days before the shoot date, the client will be charged a 100% fee. All cancellations must be in writing. Likewise, requests for rescheduling the photo shoot shall be intimated to us well in advance of the initial agreed date. In case of delayed intimation, we may not guarantee booking on your preferred new dates.
                        </div>

                        <div className="relative">
                            <span className="absolute -left-4 top-0 font-bold">•</span>
                            <span className="font-bold text-[#1A1A1A]">DISTURBANCE AT THE EVENT: </span>
                            you are looking for multiple photographers and videographers, we recommend booking within TEAM ALPHA as we have good rapport with our team members. If there are any other photographers/videographers (who are not a part of TEAM ALPHA), they must be briefed to cooperate with our team members. As candid photography and cinematography concentrates on special moments, subjects and detailing, there are chances that our crew members will appear on other team's camera frames and vice-versa. Any guests or family members behave rudely or threaten the photographers during the event, the situation should be handled by you. We believe to maintain professionalism of high standards and expect the same from all our clients. If there are any unavoidable circumstances, the entire crew will leave the premises with no further photoshoot. There shall also be no refund of any fees.
                        </div>

                        <div className="relative">
                            <span className="absolute -left-4 top-0 font-bold">•</span>
                            <span className="font-bold text-[#1A1A1A]">TRAVELING: </span>
                            We are a team based in Bengaluru. For any events/venue outside Bengaluru, all the travel expenses and accommodation must be taken care of by the client for the entire crew. If there are any events happening during the late night and the next event is scheduled in the early morning, accommodation must be taken care of by the client for the entire crew. This is applicable for Bengaluru events as well.
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 6: DATA MANAGEMENT & CONTACT */}
            <div className={pageStyle + " pdf-page px-20 py-24 flex flex-col justify-between"}>
                <div>
                    <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-12 text-center">
                        Wedding Photography Data Management — Terms & Conditions
                    </h3>

                    <div className="space-y-8 text-[12px] text-stone-600 leading-relaxed px-2">
                        <div>
                            <span className="font-bold text-[#1A1A1A] block mb-1">1. Data Storage & Security</span>
                            As part of our commitment to delivering a premium experience, all final edited images are stored securely in our professional archive system for a period of 6 months from the date of delivery. We take every precaution to safeguard your wedding memories during this period through multiple redundant backups.
                        </div>

                        <div>
                            <span className="font-bold text-[#1A1A1A] block mb-1">2. Client Responsibility</span>
                            Upon delivery of your final gallery and/or HDD, SSD it becomes the client's responsibility to download, store, and back up their images. We highly recommend saving your photos on multiple devices and cloud services to ensure long-term preservation.
                        </div>

                        <div>
                            <span className="font-bold text-[#1A1A1A] block mb-1">3. Limitations of Liability</span>
                            While we employ best-in-class data management practices, we cannot be held liable for any data loss resulting from circumstances beyond our control (e.g. hardware failure, natural disasters, force majeure) after the guaranteed 6-month storage period.
                        </div>

                        <div>
                            <span className="font-bold text-[#1A1A1A] block mb-1">4. Requests for Additional Copies</span>
                            Should you require an additional copy of your images after the initial delivery and/or after the 6-month storage period, we will do our best to accommodate your request, subject to availability. An additional fee may apply for this service. for any data loss additional fee to made to Recover the data
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-[11px] text-[#1A1A1A] leading-relaxed mt-auto pb-4">
                    <span className="font-bold block mb-1">CONTACT US</span>
                    PHONE NUMBER: +91 9663373953 +91 8296105939<br/>
                    EMAIL: <span className="text-blue-500 underline">info@teamalphacrew.com</span><br/>
                    INSTAGRAM: @teamalpha_crew
                </div>
            </div>
        </div >
    );
});

export default EstimatePreview;
