"use client"
import React from 'react'
import PasswordUpdateForm from './password-form'
import withAuth from '@/components/withAuth';

const Page = () => {
  return (
    <PasswordUpdateForm />
  )
}

export default withAuth(Page, ["c", "p", "o", "a"]);