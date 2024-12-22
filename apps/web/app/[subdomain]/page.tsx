"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const tenant = params.subdomain;
  return <div>Welcome to {tenant} subdomain</div>;
}
