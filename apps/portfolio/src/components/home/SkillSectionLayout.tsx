'use client';
import { FrankTabs } from '@frankjhub/shared-ui-hero-client';
import { HeroTitle } from '@frankjhub/shared-ui-core';
import { EducationCard } from '../../components/home/SkillSectionLayout/EducationCard';
import { WorkCard } from './SkillSectionLayout/WorkCard';
import { Spacer } from '@heroui/react';

export const SkillSectionLayout = () => {
  return (
    <div className="bg-red-200 w-full h-full amd:pt-8">
      {/* Title */}
      <div>
        <HeroTitle>Skills</HeroTitle>
      </div>
      {/* Description */}
      <div className="text-color-text-black font-popins max-w-[700px]">
        <h1 className="text-3xl font-bold">Skills & Qualification</h1>
        <p>
          For more than 4 years I have been accomplishing not enough with modern Web Development,
          new generation web and App programming language.
        </p>
      </div>
      {/* Content */}
      <div className="grid grid-cols-3 text-sm">
        {/* Qualifications */}
        <div>
          <FrankTabs
            ariaLable="work and education"
            tabsData={[
              {
                key: 'work',
                title: 'Work',
                content: (
                  <div>
                    <WorkCard
                      companyName="DMSolving Corp."
                      workType="full-time"
                      workPeriod="2023-2025"
                      jobTitle="Full-stack Developer"
                      jobDescription="Full Stack Developer for Noqclinic, building scalable features with React, Node.js, and microservices, focusing on frontend optimization, secure authentication, and CI/CD."
                    />
                    <Spacer y={2} />
                    <WorkCard
                      companyName="Mark2win Corp."
                      workType="part-time"
                      workPeriod="2021-2023"
                      jobTitle="Full-stack Developer"
                      jobDescription="Developed the e-commerce platform SPA by using React, React-Redux, Redux-Form, with(Express & NodeJS) as REST API backend to talk to database(MySQL)"
                    />
                  </div>
                ),
              },
              {
                key: 'education',
                title: 'Education',
                content: (
                  <div>
                    <EducationCard
                      year="2018-2019"
                      program="Computer Programmer"
                      school="Seneca"
                      location="ON, Canada"
                    />
                  </div>
                ),
              },
            ]}
            color="primary"
          />
        </div>
        {/* skills */}
        <div className="col-span-2 bg-yellow-200">skills</div>
      </div>
    </div>
  );
};
