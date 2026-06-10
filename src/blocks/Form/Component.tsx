'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

// Forms with this title bypass Payload and post straight to the Google Sheet
// (see src/app/(frontend)/mailing-list/subscribe/route.ts). Matches the title
// seeded in src/endpoints/seedMailingList.ts.
const MAILING_LIST_FORM_TITLE = 'Join the Mailing List'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // The mailing-list form posts straight to the Google Sheet (no Payload/DB),
        // so a database issue can never block a signup. Every other form still goes
        // through Payload's form-submissions endpoint.
        const isMailingList = formFromProps?.title === MAILING_LIST_FORM_TITLE

        const endpoint = isMailingList
          ? `${getClientSideURL()}/mailing-list/subscribe`
          : `${getClientSideURL()}/api/form-submissions`

        const requestBody = isMailingList
          ? JSON.stringify(
              dataToSend.reduce<Record<string, unknown>>((acc, { field, value }) => {
                acc[field] = value
                return acc
              }, {}),
            )
          : JSON.stringify({ form: formID, submissionData: dataToSend })

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(endpoint, {
            body: requestBody,
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            // Surface a real validation message for 4xx responses, but show a
            // friendly, retry-able message for 5xx / empty bodies. A server-side
            // failure (e.g. the backend being briefly unavailable) returns no
            // usable error message, so don't echo a raw "Internal Server Error".
            const serverMessage = res?.errors?.[0]?.message

            setError({
              message:
                req.status >= 500 || !serverMessage
                  ? "Sorry — we couldn't add you to the list just now. Please try again in a moment."
                  : serverMessage,
              status: String(req.status),
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message:
              "Sorry — we couldn't reach the server. Please check your connection and try again.",
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, formFromProps?.title],
  )

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && (
            <div className="mb-4 text-red-500 text-sm" role="alert">
              {error.message}
            </div>
          )}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0">
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <div className="mb-6 last:mb-0" key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              <Button form={formID} type="submit" variant="default">
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
