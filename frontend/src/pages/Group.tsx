import { useParams } from "react-router-dom"
import useGroup from "../hooks/useGroup";

const Group = () => {

  const { idGroup } = useParams();

  return (
    <div>Group</div>
  )
}

export default Group