import React from "react";
import { notFound } from "next/navigation";
import { getSoftwareBySlug } from "@/services/software.service";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRightIcon,
  Check,
  PhoneIcon,
  Share2Icon,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getSoftwareBySlug(slug);

  if (result.status == 404) {
    console.log("result - ", result);
    notFound();
  }
  if (result.status == 200) {
    const software = result.data;

    return (
      <div className="mx-auto my-5">
        {/* Header Section */}
        <div className="p-[40px] relative flex flex-col justify-between mb-5">
          {/* Added styling for container */}
          <Image
            src="/pink-bg.svg"
            alt="pink-bg"
            width={100}
            height={100}
            className="absolute top-0 left-0 w-full h-full rounded-2xl object-cover -z-10"
          />
          <div className="flex flex-col md:flex-row items-start gap-8">
            {" "}
            {/* Adjusted for layout */}
            <div className="w-36 h-36 relative flex-shrink-0">
              {" "}
              {/* Logo */}
              {software?.logo ? (
                <img
                  src={software.logo}
                  alt={software.softwareName}
                  className="w-full h-full object-cover rounded-lg shadow"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center shadow">
                  <span className="text-gray-400">No logo</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-row justify-between">
              {" "}
              {/* Details and Buttons Container */}
              <div className="">
                <h1 className="text-[46px] mb-2 leading-none font-bold text-[#0A1837]">
                  {software?.softwareName}
                </h1>
                {/* Assuming 'By Attio Ltd' is part of description or another field, keeping description for now */}
                <p className="text-gray-600 mb-4">By XYZ Ltd</p>

                {/* SoftwareHunt Rating and Last Updated */}
                <div className="flex flex-col items-start gap-1 font-sans">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2 font-normal">
                      SoftwareHunt Rating
                    </span>
                    <Star className="w-5 h-5 fill-[#F79C30] text-[#F79C30]" />
                    <span className="ml-1 text-gray-700">
                      {software?.softwareHuntReview?.easeOfUse} / 10
                    </span>{" "}
                    {/* Using assumed rating field */}
                  </div>
                  <span className="text-sm text-gray-600">
                    Last updated on{" "}
                    {software?.updatedAt &&
                      software?.updatedAt.toLocaleDateString()}
                  </span>{" "}
                  {/* Using assumed date field */}
                </div>
              </div>
              {/* Buttons */}
              <div className="flex flex-col items-center justify-end gap-4 mt-4">
                {" "}
                {/* Buttons Container */}
                {software?.website && (
                  <Link
                    href={software.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full text-sm font-medium border border-black bg-transparent h-10 px-4 py-2" // Example button styling
                  >
                    <ArrowRightIcon className="mr-2 h-4 w-4" /> Visit Website{" "}
                    {/* Assuming you have an ArrowRightIcon */}
                  </Link>
                )}
                {/* New "Talk to expert" button */}
                <Link
                  href={"/contact-us"}
                  className="inline-flex items-center justify-center text-sm font-medium bg-indigo text-primary-foreground rounded-full hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {" "}
                  {/* Example button styling */}
                  <PhoneIcon className="mr-2 h-4 w-4" />{" "}
                  {/* Assuming you have a PhoneIcon */}
                  Talk to expert
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 justify-between mb-5">
          {/* Sidebar Nagivation Button */}
          <div className="col-span-2 w-full rounded-2xl h-min]">
            <div className="border border-[#d4d4d482] p-1.5 flex flex-col items-start space-y-2 rounded-2xl mb-2">
              <Button
                variant={"none"}
                className={`flex justify-start text-[18px] w-full bg-[#55047e35] font-semibold`}
              >
                Overview
              </Button>
              <Button
                variant={"none"}
                className={`flex justify-start text-[18px] w-full font-normal`}
              >
                Features
              </Button>
              <Button
                variant={"none"}
                className={`flex justify-start text-[18px] w-full font-normal`}
              >
                Gallery
              </Button>
              <Button
                variant={"none"}
                className={`flex justify-start text-[18px] w-full font-normal`}
              >
                Pricing
              </Button>
              <Button
                variant={"none"}
                className={`flex justify-start text-[18px] w-full font-normal`}
              >
                Compare
              </Button>
              <Button
                variant={"none"}
                className={`flex justify-start text-[18px] w-full font-normal`}
              >
                Related Tools
              </Button>
            </div>
            <Button
              variant={"none"}
              id="overview"
              className="border border-[#d4d4d482] rounded-2xl text-[18px] w-full font-normal"
            >
              <Share2Icon /> Share
            </Button>
          </div>
          {/* Main Content */}
          <div className="col-span-10 w-full rounded-2xl border border-[#d4d4d482] py-4 px-8">
            {/* Company Overview */}
            <div className="flex flex-col items-start space-y-2 mb-4">
              <h4 className="font-semibold text-[28px] mb-4">
                Company Overview
              </h4>
              <div className="text-[#5D5D5D] font-sans font-normal space-y-1">
                {software?.description
                  ?.split(/(?<=[^.]\.)(?=\s[A-Z])/g)
                  ?.map((sentence, index) => (
                    <p key={index} className="mb-4.5 text-[20px]">
                      {sentence.trim()}
                    </p>
                  ))}
              </div>
              {/* <p className="text-[#5D5D5D] font-sans font-normal">{software?.description}</p> */}
            </div>

            {/* What SoftwareHunt Thinks */}
            <div className="flex flex-col items-start space-y-2 mb-4">
              <h4 className="font-semibold text-[28px] mb-4">
                What SoftwareHunt Thinks
              </h4>
              <p className="text-[#5D5D5D] font-sans font-normal text-[20px] mb-4.5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
                voluptate delectus repellat. Esse delectus laboriosam
                consequatur debitis numquam, possimus nulla porro voluptas alias
                exercitationem dolore quos consectetur repellat tempora officia?
                Deleniti recusandae voluptatum beatae quis sequi odit et facere
                aliquid! Error voluptas voluptate eveniet iure inventore fugiat
                ut eius molestiae!
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              {software?.softwareHuntReview?.pros &&
                software?.softwareHuntReview?.pros?.length > 0 && (
                  <div className="rounded-2xl border border-[#d4d4d482] py-4 px-8">
                    <h3 className="font-semibold mb-2 text-[20px]">Pros</h3>
                    <div className="flex flex-col gap-2">
                      {software?.softwareHuntReview?.pros?.map((pro, index) => (
                        <p
                          key={index}
                          className="flex items-center text-[#5D5D5D] font-sans font-normal text-[20px]"
                        >
                          <Check className="mr-2" color="green" /> {pro}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              {software?.softwareHuntReview?.cons &&
                software?.softwareHuntReview?.cons?.length > 0 && (
                  <div className="rounded-2xl border border-[#d4d4d482] py-4 px-8">
                    <h3 className="font-semibold mb-2 text-[20px]">Cons</h3>
                    <div className="flex flex-col gap-2">
                      {software?.softwareHuntReview?.cons?.map((con, index) => (
                        <p
                          key={index}
                          className="flex items-center text-[#5D5D5D] font-sans font-normal text-[20px]"
                        >
                          <X className="mr-2" color="red" /> {con}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Features */}
            <div className="bg-indigo text-white rounded-2xl border border-[#d4d4d482] py-4 px-8 mb-4">
              <h4 className="font-sans font-semibold text-[28px] mb-4">
                Features
              </h4>
              <div className="features-list grid grid-cols-2 space-y-2">
                {software?.key_features?.map((feature) => (
                  <p
                    key={feature.featureId}
                    className="flex items-center mb-4.5"
                  >
                    <Check className="mr-2" />
                    {feature.name}
                  </p>
                ))}
              </div>
              
            </div>

          


            {/* Pricing Tiers */}
            {!software?.isFree &&
              software?.pricing_tiers &&
              software?.pricing_tiers.length > 0 && (
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Pricing Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {software.pricing_tiers.map((tier, index) => (
                      <Card key={index} className="p-4 border-2">
                        <h3 className="font-semibold mb-2">{tier.tierName}</h3>
                        <div className="text-2xl font-bold mb-2">
                          {tier.isDiscounted ? (
                            <>
                              <span className="line-through text-gray-500 mr-2">
                                ₹{tier.price}
                              </span>
                              <span className="text-red-600">
                                ₹
                                {(
                                  Number(tier.price) *
                                  (1 - Number(tier.discount) / 100)
                                ).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500">
                                /{tier.duration}
                              </span>
                            </>
                          ) : (
                            <>
                              ₹{tier.price}
                              <span className="text-sm text-gray-500">
                                /{tier.duration}
                              </span>
                            </>
                          )}
                        </div>
                        {tier.isDiscounted && (
                          <Badge variant="destructive" className="mb-2">
                            {Number(tier.discount).toFixed(
                              Number(tier.discount) % 1 === 0 ? 0 : 1
                            )}
                            % off
                          </Badge>
                        )}
                        <div className="text-sm text-gray-600 mb-4">
                          Max Users:{" "}
                          {tier.maxUsers === 10000
                            ? "Unlimited"
                            : tier.maxUsers}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tier.features?.map((featureId) => {
                            const feature = software.key_features?.find(
                              (f) => f.featureId === featureId
                            );
                            return feature ? (
                              <Badge
                                key={featureId}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

            {/* Reviews & Ratings */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                SoftwareHunt Review
              </h2>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Ratings</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {software?.softwareHuntReview && (
                    <>
                      {(
                        [
                          "easeOfUse",
                          "scalability",
                          "budgetFriendly",
                          "customerSupport",
                          "integrationFlexibility",
                        ] as const
                      ).map((key) => (
                        <div key={key} className="flex flex-col items-center">
                          <span className="text-sm text-gray-600 mb-1">
                            {key
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">
                              {software.softwareHuntReview[key]}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Testimonials */}
            {software?.testimonies && software?.testimonies.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Customer Testimonials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {software.testimonies.map((testimony, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-gray-600 mb-2">
                        "{testimony?.userName}"
                      </p>
                      <div className="flex items-center gap-2">
                        {testimony.testimony && (
                          <span className="font-semibold">
                            {testimony.testimony}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }
}
