type Props = {
  number: string;
  text: string;
};

const StartSteps = ({ number, text }: Props) => (
  <div className={`flex-center flex-row`}>
    <div className={`flex-center w-[70px] h-[70px] rounded-[24px] bg-[#323F5D]`}>
      <p className="font-bold text-[20px] text-white">{number}</p>
    </div>
    <p className="flex-1 ml-[30px] font-normal text-[18px] text-[#B0B0B0] leading-[32.4px]">{text}</p>
  </div>
);

export default StartSteps;
