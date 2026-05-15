import React from 'react';
import { notFound } from 'next/navigation';
import metalData from '../../../../src/data/metalData.json';
import concreteData from '../../../../src/data/concreteData.json';
import houseData from '../../../../src/data/houseData.json';
import earthworkData from '../../../../src/data/earthworkData.json';

import { MetalWeightCalculator } from '../../../../src/components/calculators/MetalWeightCalculator';
import { ConcreteCalculator } from '../../../../src/components/calculators/ConcreteCalculator';
import { HouseEstimator } from '../../../../src/components/calculators/HouseEstimator';
import { EarthworkCalculator } from '../../../../src/components/calculators/EarthworkCalculator';
import { SEOContent } from '../../../../src/components/calculators/SEOContent';
import { JsonLd } from '../../../../src/components/calculators/JsonLd';
import { RelatedCalculators } from '../../../../src/components/calculators/RelatedCalculators';

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];

  metalData.forEach((item: any) => {
    params.push({ category: 'metal', slug: item.slug });
  });

  concreteData.forEach((item: any) => {
    params.push({ category: 'concrete', slug: item.slug });
  });

  houseData.forEach((item: any) => {
    params.push({ category: 'house', slug: item.slug });
  });

  earthworkData.forEach((item: any) => {
    params.push({ category: 'earthworks', slug: item.slug });
  });

  return params;
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  let data;
  switch (params.category) {
    case 'metal': data = metalData.find((d: any) => d.slug === params.slug); break;
    case 'concrete': data = concreteData.find((d: any) => d.slug === params.slug); break;
    case 'house': data = houseData.find((d: any) => d.slug === params.slug); break;
    case 'earthworks': data = earthworkData.find((d: any) => d.slug === params.slug); break;
  }

  if (!data) return { title: 'Not Found' };

  const related = data.related_keywords ? data.related_keywords.slice(0, 2).join(' and ') : 'civil engineering estimations';

  return {
    title: `${data.target_keyword} | Free Civil Engineering Calculator`,
    description: `Accurately calculate ${data.target_keyword}. Explore expert tools for ${related} to streamline your material takeoff and cost estimation workflows.`,
    keywords: data.related_keywords?.join(', '),
  };
}

export default function CalculatorPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  
  let data;
  let componentToRender;

  switch (category) {
    case 'metal':
      data = metalData.find((d: any) => d.slug === slug);
      if (data) componentToRender = <MetalWeightCalculator initialData={data} />;
      break;
    case 'concrete':
      data = concreteData.find((d: any) => d.slug === slug);
      if (data) componentToRender = <ConcreteCalculator initialData={data} />;
      break;
    case 'house':
      data = houseData.find((d: any) => d.slug === slug);
      if (data) componentToRender = <HouseEstimator initialData={data} />;
      break;
    case 'earthworks':
      data = earthworkData.find((d: any) => d.slug === slug);
      if (data) componentToRender = <EarthworkCalculator initialData={data} />;
      break;
    default:
      notFound();
  }

  if (!data || !componentToRender) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <JsonLd category={category} data={data} />
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl capitalize">
            {data.target_keyword}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 mx-auto">
            Professional estimation tools for site engineers and quantity surveyors.
          </p>
        </header>

        {componentToRender}

        <section className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <SEOContent category={category as any} data={data} />
        </section>

        <RelatedCalculators category={category} currentSlug={slug} />
      </div>
    </div>
  );
}
