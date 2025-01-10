import styles from "./TeamsSection.module.css";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import { redactedScript } from "@/app/fonts";

export default function Loader() {
  return (
    <div style={{ height: "200px" }} className={styles.teamWrapper}>
      <div className={`${styles.teamHeader} ${redactedScript.className}`}>
        Team Name <Tag>--</Tag>
      </div>
      <ThrowCurse teamId={""} coins={0} placeholder={true} />
    </div>
  );
}
