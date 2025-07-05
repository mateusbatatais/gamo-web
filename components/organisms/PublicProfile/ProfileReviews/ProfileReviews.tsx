// components/organisms/PublicProfile/ProfileReviews/ProfileReviews.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";

interface ReviewItem {
  title: string;
  platform: string;
  status: string;
  content: string;
  rating: number;
  date: string;
}

interface ProfileReviewsProps {
  reviews: ReviewItem[];
}

export const ProfileReviews = ({ reviews }: ProfileReviewsProps) => {
  const t = useTranslations("PublicProfile");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">{t("recentlyReviewed")}</h3>
        <Button variant="transparent" size="sm">
          {t("seeMore")}
        </Button>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-6 dark:border-gray-700 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg dark:text-white">{review.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {review.platform}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      review.status === "Abandoned"
                        ? "bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300"
                        : "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-primary-500 text-white px-2 py-1 rounded font-bold">
                  {review.rating}/5
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{review.date}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300 line-clamp-3">{review.content}</p>

            <Button variant="transparent" className="mt-3 text-primary-600 dark:text-primary-400">
              {t("readFullReview")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
