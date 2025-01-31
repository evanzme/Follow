import clsx from "clsx"
import { AnimatePresence, m } from "framer-motion"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { FollowIcon } from "~/components/icons/follow"
import { MotionButtonBase } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { useCurrentModal } from "~/components/ui/modal"
import { modalMontionConfig } from "~/components/ui/modal/stacked/constants"
import type { LoginRuntime } from "~/lib/auth"
import { loginHandler } from "~/lib/auth"
import { stopPropagation } from "~/lib/dom"

interface LoginModalContentProps {
  runtime?: LoginRuntime
  canClose?: boolean
}
export const LoginModalContent = (props: LoginModalContentProps) => {
  const modal = useCurrentModal()

  const { canClose = true, runtime } = props

  const { t } = useTranslation()

  const [loadingLockSet, setLoadingLockSet] = useState<false | string>(false)

  return (
    <div className="center flex h-full" onClick={canClose ? modal.dismiss : undefined}>
      <m.div
        className="shadow-modal rounded-lg border border-border bg-theme-background p-4 px-8 pb-8"
        onClick={stopPropagation}
        {...modalMontionConfig}
      >
        <div className="mb-8 mt-4 text-center align-middle font-sans text-2xl font-bold leading-relaxed">
          <span className="text-xl">{t("signin.sign_in_to")}</span>
          <span className="center flex translate-y-px gap-2 font-theme text-accent">
            <FollowIcon className="size-4" />
            {APP_NAME}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <MotionButtonBase
            className={clsx(
              "center h-[48px] w-[320px] rounded-[8px] !bg-black font-sans text-base font-medium text-white hover:!bg-black/80 focus:!border-black/80 focus:!ring-black/80",
              !!loadingLockSet && "pointer-events-none opacity-50",
              "overflow-hidden",
            )}
            disabled={!!loadingLockSet}
            onClick={() => {
              loginHandler("github", runtime)
              setLoadingLockSet("github")
            }}
          >
            <LoginButtonContent isLoading={loadingLockSet === "github"}>
              <i className="i-mgc-github-cute-fi mr-2 text-xl" />
              {t("signin.continue_with_github")}
            </LoginButtonContent>
          </MotionButtonBase>
          <MotionButtonBase
            disabled={!!loadingLockSet}
            className={clsx(
              "center h-[48px] w-[320px] rounded-[8px] bg-blue-500 font-sans text-base font-medium text-white hover:bg-blue-500/90 focus:!border-blue-500/80 focus:!ring-blue-500/80",
              !!loadingLockSet && "pointer-events-none opacity-50",
              "overflow-hidden",
            )}
            onClick={() => {
              loginHandler("google", runtime)
              setLoadingLockSet("google")
            }}
          >
            <LoginButtonContent isLoading={loadingLockSet === "google"}>
              <i className="i-mgc-google-cute-fi mr-2 text-xl" />
              {t("signin.continue_with_google")}
            </LoginButtonContent>
          </MotionButtonBase>
        </div>
      </m.div>
    </div>
  )
}

const LoginButtonContent = (props: { children: React.ReactNode; isLoading: boolean }) => {
  const { children, isLoading } = props
  return (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <m.div
          animate={{
            y: 0,
            opacity: 1,
          }}
          initial={{
            y: -30,
            opacity: 0,
          }}
          transition={{
            type: "spring",
          }}
          key="loading"
          className="contents"
        >
          <LoadingCircle size={"medium"} />
        </m.div>
      ) : (
        <m.div
          key="text"
          className="center"
          transition={{
            type: "spring",
          }}
          exit={{
            y: "-100%",
            opacity: 0,
          }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  )
}
