'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

import styles from "@/app/nav.module.css";

export default function Nav() {
  const { user } = useUser();

  return (
    <div className={styles.topnav}>
      <a>
        <div aria-label="Company logo" className="logoImage">
        </div>
      </a>

      {user && (
        <>
          <a href="/api/auth/logout" className={styles.split}>Logout</a>
          <Link href="/profile" className={styles.split}>Profile</Link>
        </>
      )}

      <Link href="/editor" className={styles.split}>Editor</Link>
      <Link href="/" className={styles.split}>Home</Link>
    </div>
  );
}