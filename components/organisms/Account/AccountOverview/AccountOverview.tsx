// components/organisms/Account/AccountOverview/AccountOverview.tsx
import React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import {
  Lock,
  Settings,
  ShoppingBag,
  User,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card } from "@/components/atoms/Card/Card";

export default function AccountOverview() {
  const t = useTranslations("account.overview");

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("totalSales")}
          value="24"
          change="+12%"
          icon={<ShoppingBag className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title={t("pendingOrders")}
          value="3"
          icon={<AlertCircle className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title={t("completedTransactions")}
          value="21"
          change="+5%"
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title={t("accountRating")}
          value="4.8"
          icon={<Info className="w-5 h-5" />}
          color="info"
        />
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades recentes */}
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
            <ActivityItem title="Pedido #12345 concluído" date="2023-10-15" status="success" />
            <ActivityItem title="Alteração de senha" date="2023-10-10" status="info" />
            <ActivityItem title="Novo console cadastrado" date="2023-10-05" status="success" />
            <ActivityItem title="Pagamento pendente" date="2023-10-01" status="warning" />
          </div>
        </Card>

        {/* Ações rápidas */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t("quickActions")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              title={t("editProfile")}
              icon={<User className="w-6 h-6" />}
              href="/account/details"
              color="primary"
            />
            <ActionCard
              title={t("changePassword")}
              icon={<Lock className="w-6 h-6" />}
              href="/account/security"
              color="primary"
            />
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
            />
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

const ActivityItem = ({
  title,
  date,
  status,
}: {
  title: string;
  date: string;
  status: "success" | "warning" | "info" | "danger";
}) => {
  const statusClasses = {
    success: "bg-success-500",
    warning: "bg-warning-500",
    info: "bg-info-500",
    danger: "bg-danger-500",
  };

  return (
    <div className="flex items-start">
      <div className={`w-2 h-2 rounded-full mt-2.5 flex-shrink-0 ${statusClasses[status]}`}></div>
      <div className="ml-3 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    </div>
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
      className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${colorClasses[color]}`}
    >
      <div className={`p-3 rounded-lg ${iconClasses[color]}`}>{icon}</div>
      <span className="font-medium text-gray-900 dark:text-white">{title}</span>
    </a>
  );
};
