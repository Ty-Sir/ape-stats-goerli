import { React } from "react";
import { storiesOf } from "@storybook/react";
import { ApeStatBar, ApeUnusedSerums, ApeMatchedItems } from "../index";
import { useStakedAmount } from "../index";

const stories = storiesOf("Ape Components", module);

stories.add("Ape Stat Bar", () => {
  return (
    <div>
      <ApeStatBar stakersAddress="0x2ae7ac4d95e1bfe1172fae1c8efe9097119216cf" />
      <ApeStatBar
        tokenId={"71"}
        poolId="1"
        isTestnet={false}
        theme={{
          skeletonBackgroundColor: "pink",
        }}
      />
      <ApeStatBar tokenId={"7970"} poolId="2" />
      <ApeStatBar tokenId={"8622"} poolId="3" />
    </div>
  );
});

stories.add("ApeUnusedSerums", () => {
  return (
    <div>
      <ApeUnusedSerums
        tokenId="416"
        baseUrl={"apecoinmarketplace.com"}
        theme={{
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          skeletonBackgroundColor: "pink",
          imageGap: "2rem",
        }}
      />
    </div>
  );
});

const Demo = () => {
  const { stakedAmount } = useStakedAmount(false, "0", "", "0x2ae7ac4d95e1bfe1172fae1c8efe9097119216cf");
  return <div>{stakedAmount}</div>;
};

stories.add("Hook", () => <Demo />);

stories.add("ApeMatchedItems", () => {
  return (
    <div>
      <ApeMatchedItems
        tokenId="4429"
        baseUrl="apecoinmarketplace.com"
        collectionId={"0"}
        theme={{
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem",
        }}
      />
      <ApeMatchedItems
        tokenId="6441"
        baseUrl="apecoinmarketplace.com"
        collectionId={"2"}
        theme={{
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem",
        }}
      />
      <ApeMatchedItems
        tokenId="4271"
        baseUrl="apecoinmarketplace.com"
        collectionId={"2"}
        theme={{
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem",
        }}
      />
      {/* <ApeMatchedItems
        tokenId="5840"
        baseUrl="apecoinmarketplace.com"
        collectionId={"1"}
        theme={{
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem",
        }}
      /> */}
    </div>
  );
});
