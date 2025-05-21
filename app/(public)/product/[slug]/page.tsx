import React from "react";
import { notFound } from "next/navigation";
import { getSoftwareBySlug } from "@/services/software.service";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const result = await getSoftwareBySlug(slug);

  if ("error" in result) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">{result.error}</h1>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const software = result.data;

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex items-start gap-8 mb-8">
        <div className="w-32 h-32 relative">
          {software.logo ? (
            <img
              src={software.logo}
              alt={software.softwareName}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No logo</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{software.softwareName}</h1>
          <p className="text-gray-600 mb-4">{software.description}</p>

          <div className="flex gap-2 mb-4">
            <Badge
              variant={software.status === "ACTIVE" ? "default" : "secondary"}
            >
              {software.status}
            </Badge>
            <Badge variant={software.isFree ? "secondary" : "default"}>
              {software.isFree ? "Free" : "Paid"}
            </Badge>
          </div>

          {software.website && (
            <a
              href={software.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Business Needs & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Business Needs</h2>
          <div className="flex flex-wrap gap-2">
            {software.business_needs?.map((need) => (
              <Badge key={need.businessNeedsId} variant="outline">
                {need.name}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <div className="flex flex-wrap gap-2">
            {software.key_features?.map((feature) => (
              <Badge key={feature.featureId} variant="secondary">
                {feature.name}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Pain Points */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pain Points Addressed</h2>
        <div className="flex flex-wrap gap-2">
          {software.pain_points?.map((point) => (
            <Badge key={point.painPointId} variant="destructive">
              {point.name}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Pricing Tiers */}
      {!software.isFree &&
        software.pricing_tiers &&
        software.pricing_tiers.length > 0 && (
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
                          ₹{(Number(tier.price) * (1 - Number(tier.discount) / 100)).toFixed(2)}
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
                      {Number(tier.discount).toFixed(Number(tier.discount) % 1 === 0 ? 0 : 1)}% off
                    </Badge>
                  )}
                  <div className="text-sm text-gray-600 mb-4">
                    Max Users:{" "}
                    {tier.maxUsers === 10000 ? "Unlimited" : tier.maxUsers}
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
        <h2 className="text-xl font-semibold mb-4">SoftwareHunt Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Pros</h3>
            <div className="flex flex-wrap gap-2">
              {software.softwareHuntReview.pros?.map((pro, index) => (
                <Badge key={index} variant="secondary">
                  {pro}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cons</h3>
            <div className="flex flex-wrap gap-2">
              {software.softwareHuntReview.cons?.map((con, index) => (
                <Badge key={index} variant="destructive">
                  {con}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Ratings</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(software.softwareHuntReview).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <span className="text-sm text-gray-600 mb-1">
                  {key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{value}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Testimonials */}
      {software.testimonies && software.testimonies.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {software.testimonies.map((testimony, index) => (
              <Card key={index} className="p-4">
                <p className="text-gray-600 mb-2">"{testimony?.userName}"</p>
                <div className="flex items-center gap-2">
                  {testimony.testimony && (
                    <span className="font-semibold">{testimony.testimony}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Page;
