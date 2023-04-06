const Caution = () => {
  return (
    <div className="items-center gap-x-6 bg-red-500 py-2.5 px-6 sm:px-3.5 sm:before:flex-1 rounded-md">
      <p className="text-sm leading-6 text-white text-center">
        <a href="#">
          <strong className="font-semibold">
            This page is currently under development.
          </strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Proceed With Caution&nbsp;
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  )
}

export default Caution
