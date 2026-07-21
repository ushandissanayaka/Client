import React from "react";
import SkinDiseasesCardCompo from "../components/SkinDiseasesCardCompo";

export default function Home() {
  return (
    <div>
      <div>
        <SkinDiseasesCardCompo text="Acne" />
        <SkinDiseasesCardCompo text="Psoriasis" />
        <SkinDiseasesCardCompo text="Melanoma" />
      </div>
    </div>
  );
}
