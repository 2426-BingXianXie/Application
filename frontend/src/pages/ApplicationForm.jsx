import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FileText, ArrowLeft, Loader2, Save, Send } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { QUINCY_PERMIT_TYPES } from '../utils/constants'
import permitTypesService from '../services/permitTypesService'
import applicationService from '../services/applicationService'
import { useNotifications } from '../context/NotificationContext'

const defaultSchema = yup.object({
    applicantName: yup.string().required('Name is required').trim(),
    applicantEmail: yup.string().email('Valid email required').required('Email is required'),
    applicantPhone: yup.string().trim(),
    propertyAddress: yup.string().required('Property address is required').trim(),
    description: yup.string().required('Description of work is required').trim()
})

function ApplicationForm() {
    const { permitTypeSlug } = useParams()
    const navigate = useNavigate()
    const { showSuccess, showError } = useNotifications()
    const [permitType, setPermitType] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm({
        resolver: yupResolver(defaultSchema),
        defaultValues: {
            applicantName: '',
            applicantEmail: '',
            applicantPhone: '',
            propertyAddress: '',
            description: ''
        }
    })

    useEffect(() => {
        const load = async () => {
            if (!permitTypeSlug) {
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const fromApi = await permitTypesService.getBySlug(permitTypeSlug).catch(() => null)
                if (fromApi) {
                    setPermitType(fromApi)
                    return
                }
                const fromList = QUINCY_PERMIT_TYPES.find((p) => p.slug === permitTypeSlug)
                setPermitType(fromList || null)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [permitTypeSlug])

    const onSubmit = async (data, asDraft = false) => {
        if (!permitType) return
        try {
            setSubmitting(true)
            const payload = {
                permitTypeId: permitType.id ?? permitType.slug,
                permitTypeSlug: permitType.slug,
                status: asDraft ? 'draft' : 'submitted',
                formData: data
            }
            const app = await applicationService.create(payload)
            showSuccess(
                asDraft ? 'Draft saved' : 'Application submitted',
                asDraft
                    ? 'You can continue editing from My Permits.'
                    : 'Your application has been submitted for review.'
            )
            navigate(asDraft ? '/my-permits' : `/applications/${app.id}`)
        } catch (err) {
            showError('Submission failed', err?.message || 'Could not save application. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading application form…</p>
            </div>
        )
    }

    if (!permitType) {
        return (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 text-center">
                <p className="text-amber-800 dark:text-amber-200 font-medium">Permit type not found.</p>
                <Button as={Link} to="/apply" variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to permit types
                </Button>
            </div>
        )
    }

    const name = permitType.name || permitType.title || permitTypeSlug

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    to="/apply"
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to permit types
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {permitType.description || 'Complete the form below to apply.'}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit((data) => onSubmit(data, false))}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-5"
            >
                <Input
                    label="Applicant name"
                    required
                    {...register('applicantName')}
                    error={errors.applicantName?.message}
                    placeholder="Full name"
                />
                <Input
                    label="Email"
                    type="email"
                    required
                    {...register('applicantEmail')}
                    error={errors.applicantEmail?.message}
                    placeholder="you@example.com"
                />
                <Input
                    label="Phone"
                    {...register('applicantPhone')}
                    placeholder="(555) 000-0000"
                />
                <Input
                    label="Property address"
                    required
                    {...register('propertyAddress')}
                    error={errors.propertyAddress?.message}
                    placeholder="Street, City, State, ZIP"
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description of work <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the work or request..."
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={submitting}
                        onClick={handleSubmit((data) => onSubmit(data, true))}
                        startIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    >
                        Save draft
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        startIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    >
                        Submit application
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ApplicationForm
