// components/organisms/Account/AccountOverview/AccountOverview.tsx
import React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import {
  Lock,
  User,
  ArrowUpRight,
  Gamepad2,
  Monitor,
  Headphones,
  Package,
  Activity,
  PlusCircle,
} from "lucide-react";
import { Card } from "@/components/atoms/Card/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import { useUserActivities } from "@/hooks/useUserActivities";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { Link } from "@/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

export default function AccountOverview() {
  const t = useTranslations("account.overview");
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: activities, isLoading: activitiesLoading } = useUserActivities();
  const { getSafeImageUrl } = useSafeImageUrl();
  const locale = useLocale();
  const dateLocale = locale === "pt" ? ptBR : enUS;

  const totalItems = stats ? stats.games + stats.consoles + stats.accessories : 0;

  const getIcon = (type: string) => {
    switch (type) {
      case "GAME":
        return <Gamepad2 size={16} className="text-purple-500" />;
      case "CONSOLE":
        return <Monitor size={16} className="text-blue-500" />;
      case "ACCESSORY":
        return <Headphones size={16} className="text-pink-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {!statsLoading && totalItems === 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/10 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-600 dark:text-primary-300">
                <PlusCircle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("startMinting")}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/user/collection/games/add">
                <Button
                  variant="outline"
                  icon={<Gamepad2 size={16} />}
                  label={t("addGame")}
                  className="bg-white dark:bg-gray-800"
                />
              </Link>
              <Link href="/user/collection/consoles/add">
                <Button
                  variant="outline"
                  icon={<Monitor size={16} />}
                  label={t("addConsole")}
                  className="bg-white dark:bg-gray-800"
                />
              </Link>
              <Link href="/user/collection/accessories/add">
                <Button
                  variant="outline"
                  icon={<Headphones size={16} />}
                  label={t("addAccessory")}
                  className="bg-white dark:bg-gray-800"
                />
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title={t("totalGames")}
              value={stats?.games || 0}
              icon={<Gamepad2 className="w-5 h-5" />}
              color="primary"
            />
            <StatCard
              title={t("totalConsoles")}
              value={stats?.consoles || 0}
              icon={<Monitor className="w-5 h-5" />}
              color="info"
            />
            <StatCard
              title={t("totalAccessories")}
              value={stats?.accessories || 0}
              icon={<Headphones className="w-5 h-5" />}
              color="warning"
            />
            <StatCard
              title={t("totalItems")}
              value={totalItems}
              icon={<Package className="w-5 h-5" />}
              color="success"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("recentActivity")}
            </h2>
            <Button
              variant="transparent"
              size="sm"
              label={t("viewAll")}
              icon={<ArrowUpRight size={16} />}
              className="text-primary-600 dark:text-primary-400"
            />
          </div>

          <div className="space-y-4">
            {activitiesLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </>
            ) : activities && activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 group">
                  {/* User Avatar */}
                  <Link href={`/user/${activity.userSlug}`} className="shrink-0 relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-400 dark:border-gray-700">
                      <SafeImage
                        src={getSafeImageUrl(activity.userImage)}
                        alt={activity.userName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-100 dark:border-gray-700">
                      {getIcon(activity.type)}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium text-gray-900 dark:text-white ">
                        {activity.itemName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </div>
                  </div>

                  {/* Item Image (Optional) */}
                  {activity.itemImage && (
                    <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 relative">
                      <SafeImage
                        src={getSafeImageUrl(activity.itemImage)}
                        alt={activity.itemName}
                        fill
                        sizes="48px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                {t("noActivities")}
              </p>
            )}
          </div>
        </Card>

        {/* Ações rápidas */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t("quickActions")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              title={t("publicProfile")}
              icon={<User className="w-6 h-6" />}
              href={`user/${user?.slug}`}
              color="primary"
            />
            <ActionCard
              title={t("changePassword")}
              icon={<Lock className="w-6 h-6" />}
              href="/account/security"
              color="primary"
            />
            {/*             
            <ActionCard
              title={t("viewSales")}
              icon={<ShoppingBag className="w-6 h-6" />}
              href="/account/sales"
              color="warning"
            />
            <ActionCard
              title={t("settings")}
              icon={<Settings className="w-6 h-6" />}
              href="/account/settings"
              color="success"
            /> */}
          </div>
        </Card>
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  color = "primary",
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "danger" | "warning" | "info";
}) => {
  const colorClasses = {
    primary: "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300",
    success: "bg-success-100 dark:bg-success-900/50 text-success-600 dark:text-success-300",
    danger: "bg-danger-100 dark:bg-danger-900/50 text-danger-600 dark:text-danger-300",
    warning: "bg-warning-100 dark:bg-warning-900/50 text-warning-600 dark:text-warning-300",
    info: "bg-info-100 dark:bg-info-900/50 text-info-600 dark:text-info-300",
  };

  const changeColor = change?.startsWith("+")
    ? "text-success-600 dark:text-success-400"
    : "text-danger-600 dark:text-danger-400";

  return (
    <Card className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>

      {change && (
        <p className={`mt-2 text-sm ${changeColor}`}>
          {change} {change.startsWith("+") ? "↑" : "↓"}
        </p>
      )}
    </Card>
  );
};

const ActionCard = ({
  title,
  icon,
  href,
  color = "primary",
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  color?: "primary" | "success" | "danger" | "warning" | "info";
}) => {
  const colorClasses = {
    primary:
      "hover:bg-primary-50 dark:hover:bg-primary-900/30 border-primary-100 dark:border-primary-800",
    success:
      "hover:bg-success-50 dark:hover:bg-success-900/30 border-success-100 dark:border-success-800",
    danger:
      "hover:bg-danger-50 dark:hover:bg-danger-900/30 border-danger-100 dark:border-danger-800",
    warning:
      "hover:bg-warning-50 dark:hover:bg-warning-900/30 border-warning-100 dark:border-warning-800",
    info: "hover:bg-info-50 dark:hover:bg-info-900/30 border-info-100 dark:border-info-800",
  };

  const iconClasses = {
    primary: "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300",
    success: "bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-300",
    danger: "bg-danger-100 dark:bg-danger-900 text-danger-600 dark:text-danger-300",
    warning: "bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-300",
    info: "bg-info-100 dark:bg-info-900 text-info-600 dark:text-info-300",
  };

  return (
    <a
      href={href}
      className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${colorClasses[color]}`}
    >
      <div className={`p-3 rounded-lg ${iconClasses[color]}`}>{icon}</div>
      <span className="text-sm text-gray-900 dark:text-white">{title}</span>
    </a>
  );
};
