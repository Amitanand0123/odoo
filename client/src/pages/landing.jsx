import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_330)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">QuickDesk</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
            </div>
            <div className="flex gap-2">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cae5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em]">
                <Link to="/register"><span className="truncate">Get Started</span></Link>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#eaedf1] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em]">
                <Link to="/login"><span className="truncate">Log In</span></Link>
              </button>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Hero Section */}
            <div className="@container">
              <div className="flex gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                  style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXZvsyrQMbJJMzfi4E-g7ROUsHuhkuqufF-x3cJFETVPDXUzQgwBDc7uvHBuXWp2LzotLVLhpmUGccq0IhzGdi1isP-iRpm-UkuOsfBBtW9oydB74uVhAGDWhd3j7TEDz_KxUz8Qwgyd_pCh97WrpOaQuhqaKytbl-GRuDnnciudseqOSyPS9BaltTuzC0FuArocIMTwpO1nGPpDgBsy51bzaUoIQ8-j6AJ-eM2TkCjgE1HGy-xbr0KvWGrlDjS1JVzihERY8rMbk")'}}
                />
                <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                  <div className="flex flex-col gap-2 text-left">
                    <h1 className="text-[#101418] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Streamline Your Support with QuickDesk
                    </h1>
                    <h2 className="text-[#101418] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Manage customer inquiries efficiently with our intuitive ticketing system. Enhance your support team's productivity and ensure customer satisfaction.
                    </h2>
                  </div>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#b2cae5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                    <span className="truncate">Get Started</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#101418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                  Key Features
                </h1>
                <p className="text-[#101418] text-base font-normal leading-normal max-w-[720px]">
                  QuickDesk offers a comprehensive suite of tools to manage customer support tickets effectively.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div className="text-[#101418]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">Live Chat Integration</h2>
                    <p className="text-[#5c718a] text-sm font-normal leading-normal">
                      Engage with customers in real-time through integrated live chat, providing instant support and resolving issues quickly.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div className="text-[#101418]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M227.19,104.48A16,16,0,0,0,240,88.81V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V88.81a16,16,0,0,0,12.81,15.67,24,24,0,0,1,0,47A16,16,0,0,0,16,167.19V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V167.19a16,16,0,0,0-12.81-15.67,24,24,0,0,1,0-47ZM32,167.2a40,40,0,0,0,0-78.39V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.39Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">Efficient Ticket Management</h2>
                    <p className="text-[#5c718a] text-sm font-normal leading-normal">
                      Organize, prioritize, and track customer inquiries with our intuitive ticketing system, ensuring no issue goes unresolved.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div className="text-[#101418]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">Team Collaboration</h2>
                    <p className="text-[#5c718a] text-sm font-normal leading-normal">
                      Foster teamwork with shared inboxes, internal notes, and seamless ticket assignment, enhancing team productivity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaedf1]">
                <p className="text-[#101418] text-base font-medium leading-normal">Tickets Resolved</p>
                <p className="text-[#101418] tracking-light text-2xl font-bold leading-tight">15,000+</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaedf1]">
                <p className="text-[#101418] text-base font-medium leading-normal">Customer Satisfaction</p>
                <p className="text-[#101418] tracking-light text-2xl font-bold leading-tight">95%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaedf1]">
                <p className="text-[#101418] text-base font-medium leading-normal">Average Response Time</p>
                <p className="text-[#101418] tracking-light text-2xl font-bold leading-tight">2 hours</p>
              </div>
            </div>

            {/* How It Works */}
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#101418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                  How It Works
                </h1>
                <p className="text-[#101418] text-base font-normal leading-normal max-w-[720px]">QuickDesk simplifies the support process, from initial contact to resolution.</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
                {[
                  {
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxOyxbNIvztrCmy57tBBJglZDLWJAn8a5G0p9m6n-ZpdLZXv4DyAHitXXUVKm11i52JqWZaHEqoiHUj9xhPg95Y2S829cjM796SzVPGWvQuPOScTPSc8fvU8ez5OPv8hsXQhUSdtwP_264Abfw6dfc0393p7aKMGTZuvprtJNpTP1vTPJIn7XJ8Ysy5QN3ibMZ2-oKV1dMOfVGWOxE-of3TsGxbPMmMCfH24C0ogxCmvw-1Hfqo38q886gVDYkvD5Ba4IqXt3k9tI",
                    title: "Receive Inquiries",
                    desc: "Customers submit support requests through various channels, including email, live chat, and web forms."
                  },
                  {
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgZOQuPPtKVIELLBdu-51VMhpQtKrvfyliGKXY1LqanzQiCAyVfsPktghqUBLsaSVinaZFAfGFRukQI8qGNEtuGjDkjLTp0uUvPh4J9NZ7luhf6ldDReYIT1WyoLPpZ1SVf6y176qfUO7vS6DT-FP6b-9B2ymB_B8QNcoKilJjzy9u7gfaFB-kI60eeZ0u2vjcjPqAlPxFCXWnvvMtAp_sz08kgaCgy_-bl7KhH-nOFnN19i6oFsq7mDXCA-czn-mXLoP7JmU7qBE",
                    title: "Manage and Respond",
                    desc: "Your team efficiently manages, prioritizes, and responds to tickets using QuickDesk's intuitive interface."
                  },
                  {
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-KEQ44Q2xK4KGO1I_oY4LD-BXLghMvNmfJeraizeOSRnFeH-73VDE6S7c9rBQ1cory7zmIPlNel2V8L91oLYMSyeME_obd-d2IHdCmU5YQdwT7JSfx8cNbeh3NPnlviZuj_lSmaA8c918Ev5bpbpeNVvRe7li_Z0nCbNjf5jLR8ua3M7rk7oNOkukX-VjG7q0h0ZuYzBdkPFp2pF93NlqLtmY6a6LW5wZ_hc1AgqX_U9tDUFUU3e7187bxcattaMawHEab8zQ9dY",
                    title: "Resolve and Follow Up",
                    desc: "Once resolved, QuickDesk helps you follow up with customers to ensure satisfaction and gather feedback."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col gap-3 pb-3">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                      style={{backgroundImage: `url("${item.img}")`}}
                    />
                    <div>
                      <p className="text-[#101418] text-base font-medium leading-normal">{item.title}</p>
                      <p className="text-[#5c718a] text-sm font-normal leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-[#101418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Ready to Elevate Your Customer Support?
                  </h1>
                  <p className="text-[#101418] text-base font-normal leading-normal max-w-[720px]">
                    Join thousands of businesses that trust QuickDesk to manage their customer inquiries efficiently.
                  </p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#b2cae5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow">
                      <span className="truncate">Get Started</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-[#5c718a] text-base font-normal leading-normal min-w-40" href="#">Home</a>
                <a className="text-[#5c718a] text-base font-normal leading-normal min-w-40" href="#">Features</a>
                <a className="text-[#5c718a] text-base font-normal leading-normal min-w-40" href="#">Pricing</a>
                <a className="text-[#5c718a] text-base font-normal leading-normal min-w-40" href="#">Resources</a>
                <a className="text-[#5c718a] text-base font-normal leading-normal min-w-40" href="#">Contact Us</a>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#">
                  <div className="text-[#5c718a]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z" />
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#5c718a]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z" />
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#5c718a]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
                    </svg>
                  </div>
                </a>
              </div>
              <p className="text-[#5c718a] text-base font-normal leading-normal">© 2023 QuickDesk. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;