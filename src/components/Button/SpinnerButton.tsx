import { Button, ButtonProps, Spinner } from "flowbite-react"

interface ISpinnerButton extends ButtonProps {
  isLoading: boolean
}
const SpinnerButton: React.FC<ISpinnerButton> = ({ isLoading, ...buttonProps }) => {
  if (isLoading) {
    return (
      <Button {...buttonProps}>
        <Spinner aria-label="Spinner button example" />
        <span className="pl-3">Loading...</span>
      </Button>
    )
  }
  return <Button {...buttonProps}>{buttonProps.children}</Button>
}

export default SpinnerButton
