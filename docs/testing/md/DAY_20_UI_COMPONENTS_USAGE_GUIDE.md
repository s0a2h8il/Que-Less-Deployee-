# **DAY 20: UI COMPONENTS - EXAMPLE USAGE GUIDE**

## **1. EmptyState Component Usage**

### **Basic Usage**

```jsx
import EmptyState from "@/components/ui/EmptyState";
import { Search } from "lucide-react";

function ExploreQueues() {
  const queues = [];

  if (queues.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No Queues Found"
        description="There are no queues available right now. Create one or check back later."
        action={{
          label: "Create Queue",
          onClick: () => navigate("/create-queue"),
          variant: "primary",
        }}
        size="md"
      />
    );
  }

  // ... render queues
}
```

### **In Notifications Page**

```jsx
import EmptyState from "@/components/ui/EmptyState";
import { Bell } from "lucide-react";

function Notifications() {
  const notifications = [];

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No Notifications"
        description="You're all caught up! Check back later for updates."
        size="lg"
      />
    );
  }

  // ... render notifications
}
```

### **With Custom Size**

```jsx
<EmptyState
  icon={Database}
  title="No Analytics Data"
  description="Data will appear here once you have queue activity."
  size="sm"
/>
```

---

## **2. ErrorState Component Usage**

### **404 Error**

```jsx
import ErrorState from "@/components/ui/ErrorState";
import { useNavigate } from "react-router-dom";

function QueueDetail({ queueId }) {
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (error?.status === 404) {
    return (
      <ErrorState
        errorCode={404}
        title="Queue Not Found"
        message="The queue you're looking for doesn't exist or has been deleted."
        action={{
          label: "Explore Queues",
          onClick: () => navigate("/explore"),
        }}
        backAction={{
          label: "Go Back",
          onClick: () => navigate(-1),
        }}
      />
    );
  }

  // ... render queue
}
```

### **Server Error with Retry**

```jsx
import ErrorState from "@/components/ui/ErrorState";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRetry = async () => {
    setLoading(true);
    try {
      // Fetch data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        errorCode={500}
        title="Server Error"
        message="Something went wrong. Please try again."
        action={{
          label: "Retry",
          onClick: handleRetry,
        }}
        loading={loading}
      />
    );
  }

  // ... render dashboard
}
```

### **Authorization Error**

```jsx
import ErrorState from "@/components/ui/ErrorState";

function AnalyticsDashboard() {
  const { user } = useAuth();

  if (!user || !["admin", "superadmin"].includes(user?.role)) {
    return (
      <ErrorState
        errorCode={403}
        title="Access Denied"
        message="You don't have permission to view this page."
        isDangerous={true}
        backAction={{
          label: "Go to Home",
          onClick: () => navigate("/"),
        }}
      />
    );
  }

  // ... render analytics
}
```

---

## **3. Skeleton Component Usage**

### **Queue Card Loading**

```jsx
import { QueueCardSkeleton } from "@/components/ui/Skeleton";

function ExploreQueues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        // Fetch
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);

  return (
    <div>
      {loading ? (
        <QueueCardSkeleton count={6} />
      ) : (
        // Render actual cards
      )}
    </div>
  );
}
```

### **Table Loading**

```jsx
import { TableSkeleton } from "@/components/ui/Skeleton";

function SuperAdminDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {loading ? (
        <TableSkeleton rows={10} cols={6} />
      ) : (
        // Render actual table
      )}
    </div>
  );
}
```

### **Dashboard Loading**

```jsx
import { DashboardSkeleton } from "@/components/ui/Skeleton";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        // Render dashboard
      )}
    </div>
  );
}
```

---

## **4. PageHeader Component Usage**

### **Basic Page Header**

```jsx
import PageHeader from "@/components/ui/PageHeader";
import { List } from "lucide-react";

function ExploreQueues() {
  return (
    <>
      <PageHeader
        title="Explore Queues"
        description="Discover and join queues"
        icon={List}
      />
      {/* Page content */}
    </>
  );
}
```

### **With Back Button**

```jsx
import PageHeader from "@/components/ui/PageHeader";
import { ArrowLeft } from "lucide-react";

function QueueDetail() {
  return (
    <>
      <PageHeader
        title="Queue Details"
        description="See queue information and members"
        icon={Info}
        showBack={true}
        backTo="/explore"
      />
      {/* Queue details */}
    </>
  );
}
```

### **With Action Button**

```jsx
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

function SuperAdminDashboard() {
  return (
    <>
      <PageHeader
        title="Manage Businesses"
        description="View and manage all registered businesses"
        icon={Building2}
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/create-business")}
          >
            <Plus size={18} />
            Add Business
          </Button>
        }
      />
      {/* Businesses list */}
    </>
  );
}
```

### **Dark Variant**

```jsx
<PageHeader
  title="Analytics"
  description="View comprehensive analytics"
  icon={BarChart3}
  variant="dark"
/>
```

---

## **5. Badge Component Usage**

### **Status Badges**

```jsx
import { StatusBadge } from "@/components/ui/Badge";

function QueueCard({ queue }) {
  return (
    <div className="p-4">
      <h3>{queue.title}</h3>
      <StatusBadge status={queue.status} size="md" />
    </div>
  );
}
```

### **Custom Badges**

```jsx
import Badge from "@/components/ui/Badge";
import { Zap } from "lucide-react";

function BusinessCard({ business }) {
  return (
    <div>
      <h3>{business.name}</h3>
      <div className="flex gap-2">
        {business.verified && (
          <Badge variant="success" size="sm" icon={CheckCircle}>
            Verified
          </Badge>
        )}
        {business.featured && (
          <Badge variant="warning" size="sm" icon={Star}>
            Featured
          </Badge>
        )}
      </div>
    </div>
  );
}
```

### **Badge Group**

```jsx
import { BadgeGroup } from "@/components/ui/Badge";

function QueueDetail({ queue }) {
  return (
    <div>
      <h3>Categories</h3>
      <BadgeGroup items={queue.categories} variant="secondary" maxItems={3} />
    </div>
  );
}
```

---

## **6. ConfirmDialog Component Usage**

### **Delete Confirmation**

```jsx
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useState } from "react";

function BusinessCard({ business }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await businessApi.deleteBusiness(business._id);
      // Refresh list
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setConfirmDelete(true)}>
        Delete
      </Button>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Business?"
        message={`Are you sure you want to delete ${business.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isDangerous={true}
        loading={deleting}
      />
    </>
  );
}
```

### **Leave Queue Confirmation**

```jsx
<ConfirmDialog
  isOpen={showLeaveConfirm}
  onClose={() => setShowLeaveConfirm(false)}
  onConfirm={handleLeaveQueue}
  title="Leave Queue?"
  message="Are you sure you want to leave this queue? You'll lose your position."
  confirmLabel="Leave Queue"
  cancelLabel="Stay"
  variant="warning"
  isDangerous={false}
/>
```

---

## **7. Animation Variants Usage**

### **Basic Fade In Animation**

```jsx
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/animationVariants";

function HomePage() {
  return (
    <motion.div
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      exit={fadeIn.exit}
    >
      <h1>Welcome to QueueLess</h1>
    </motion.div>
  );
}
```

### **Staggered List**

```jsx
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/utils/animationVariants";

function QueueList({ queues }) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {queues.map((queue) => (
        <motion.div
          key={queue._id}
          variants={staggerItem}
          className="queue-card"
        >
          {/* Card content */}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### **Card Hover Effect**

```jsx
import { motion } from "framer-motion";
import { cardHover } from "@/utils/animationVariants";

function BusinessCard({ business }) {
  return (
    <motion.div variants={cardHover} className="p-4 bg-white rounded-lg border">
      <h3>{business.name}</h3>
      {/* Card content */}
    </motion.div>
  );
}
```

### **Page Transition**

```jsx
import { motion } from "framer-motion";
import { pageTransition } from "@/utils/animationVariants";

function Dashboard() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Dashboard content */}
    </motion.div>
  );
}
```

---

## **8. Formatters Usage**

### **Date Formatting**

```jsx
import { formatDate, formatRelativeTime } from "@/utils/formatters";

function NotificationItem({ notification }) {
  return (
    <div>
      <p>{notification.message}</p>
      <small>{formatRelativeTime(notification.createdAt)}</small>
    </div>
  );
}
```

### **Number Formatting**

```jsx
import {
  formatNumber,
  formatCompactNumber,
  formatPercentage,
} from "@/utils/formatters";

function AnalyticsCard({ stats }) {
  return (
    <div className="grid gap-4">
      <div>
        <p>Total Queues</p>
        <p className="text-2xl font-bold">{formatCompactNumber(stats.total)}</p>
      </div>
      <div>
        <p>Completion Rate</p>
        <p className="text-2xl font-bold">{formatPercentage(stats.rate)}</p>
      </div>
    </div>
  );
}
```

### **Text Formatting**

```jsx
import { truncateText, titleCase, formatMemberName } from "@/utils/formatters";

function QueueCard({ queue, member }) {
  return (
    <div>
      <h3>{truncateText(queue.title, 30)}</h3>
      <p>Queue Creator: {formatMemberName(member)}</p>
      <p>{titleCase(queue.category)}</p>
    </div>
  );
}
```

### **Wait Time Formatting**

```jsx
import { formatWaitTime, formatDuration } from "@/utils/formatters";

function QueueDetail({ queue, member }) {
  return (
    <div>
      <p>Average Wait Time: {formatWaitTime(queue.avgWaitTime)}</p>
      <p>Your Position Wait: {formatDuration(member.estimatedWait)}</p>
    </div>
  );
}
```

---

## **9. Updated Button Component Usage**

### **All Variants**

```jsx
import { Button } from "@/components/ui/Button";
import { Trash2, Check, AlertCircle } from "lucide-react";

function ButtonShowcase() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="success">Confirm</Button>
      <Button variant="warning">Caution</Button>
      <Button variant="info">Information</Button>
    </div>
  );
}
```

### **With Icons and Loading**

```jsx
<Button
  variant="primary"
  size="lg"
  leftIcon={<Check size={20} />}
>
  Approve Request
</Button>

<Button
  variant="danger"
  isLoading={loading}
  onClick={handleDelete}
>
  {loading ? "Deleting..." : "Delete"}
</Button>
```

### **Full Width**

```jsx
<Button variant="primary" fullWidth size="md" onClick={handleJoinQueue}>
  Join Queue
</Button>
```

---

## **10. Updated Navbar Usage**

The Navbar now automatically handles:

- ✅ Smooth animations on desktop and mobile
- ✅ Active link indicators
- ✅ Responsive menu toggle
- ✅ Role-based navigation (admin, superadmin)
- ✅ Notification bell
- ✅ Logout functionality
- ✅ Mobile drawer animations

### **No changes needed** - it's a drop-in replacement:

```jsx
import { Navbar } from "@/components/layout/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      {/* Page content */}
    </>
  );
}
```

---

## **11. Complete Page Integration Example**

### **Explore Queues Page with All Components**

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { QueueCardSkeleton } from "@/components/ui/Skeleton";
import { staggerContainer, staggerItem } from "@/utils/animationVariants";
import { Search } from "lucide-react";

function ExploreQueues() {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await queueApi.getAll();
        setQueues(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <PageHeader
          title="Explore Queues"
          description="Discover queues"
          icon={Search}
        />
        <div className="container mx-auto px-4 py-8">
          <QueueCardSkeleton count={6} />
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader title="Explore Queues" icon={Search} />
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title="Failed to Load Queues"
            message={error.message}
            action={{
              label: "Try Again",
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </>
    );
  }

  // Empty state
  if (queues.length === 0) {
    return (
      <>
        <PageHeader title="Explore Queues" icon={Search} />
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={Search}
            title="No Queues Available"
            description="There are no queues at the moment."
            size="lg"
          />
        </div>
      </>
    );
  }

  // Success state with animations
  return (
    <>
      <PageHeader
        title="Explore Queues"
        description="Find and join queues"
        icon={Search}
      />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {queues.map((queue) => (
            <motion.div
              key={queue._id}
              variants={staggerItem}
              onClick={() => navigate(`/queue/${queue._id}`)}
              className="cursor-pointer"
            >
              <QueueCard queue={queue} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export default ExploreQueues;
```

---

This guide shows how to use all new components across your application for consistent, professional UI/UX!
