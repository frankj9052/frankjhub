'use client';
import { HeroTitle } from '@frankjhub/shared-ui-core';
import Link from 'next/link';
import { FaLinkedin } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

export const ContactPageLayout = () => {
  return (
    <div className="w-full h-full md:pt-8">
      {/* Title */}
      <div className="mb-10">
        <HeroTitle>Contact Me</HeroTitle>
      </div>
      {/* Content */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-3xl font-bold text-color-text-black mb-10">
          Let&apos;s discuss the work
        </h2>
        <ul className="space-y-3 flex flex-col gap-10">
          <li>
            <div className="text-xl flex gap-2 items-center mb-3">
              <span>
                <MdEmail className="text-primary" size={24} />
              </span>
              <span className="font-semibold">Email:</span>
            </div>
            <Link
              href="mailto:frankj9052@outlook.com"
              className="text-gray-400 hover:underline ml-8"
            >
              frankj9052@outlook.com
            </Link>
          </li>
          <li>
            <div className="text-xl flex gap-2 items-center mb-3">
              <span>
                <FaLinkedin className="text-primary" size={24} />
              </span>
              <span className="font-semibold">LinkedIn:</span>
            </div>
            <Link
              href="https://www.linkedin.com/in/frank-jia"
              className="text-gray-400 hover:underline ml-8"
            >
              www.linkedin.com/in/frank-jia
            </Link>
          </li>
          <li>
            <div className="text-xl flex gap-2 items-center mb-3">
              <span>
                <FaLocationDot className="text-primary" size={24} />
              </span>
              <span className="font-semibold">Address:</span>
            </div>
            <div className="text-gray-400 hover:underline ml-8">North York, ON, Canada</div>
          </li>
        </ul>
      </div>
    </div>
  );
};
