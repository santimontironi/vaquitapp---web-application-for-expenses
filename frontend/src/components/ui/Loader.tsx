import { PropagateLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <PropagateLoader size={8} color="#BC96E6" />
    </div>
  )
}

export default Loader
