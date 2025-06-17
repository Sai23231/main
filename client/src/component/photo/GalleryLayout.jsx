import { useParams } from "react-router-dom";

const GalleryLayout = () => {
  const { id } = useParams();

  // Pinterest data based on category ID
  const pinterestData = {
    "groom-dress": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=613193305546651306" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=148126275237946515" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=20899585765550040" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=761108405811942615" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=665829126177923326" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=15199717489646995" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=12736811441769574" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=14777505021794987" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],
    "couple-outfits": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=4081455905913234" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=2955556000621069" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=135389532543670959" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=761108405811942615" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=347903139983336913" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=25192079161572592" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=825847650428152490" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=16536723626582229" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],

    "wedding-sarees": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=965459238866751058" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=24347654230170388" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=223491200253080632" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=1196337402574720" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],

    "mehndi-designs": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=1900024838547970" height="529" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=335025659801633934" height="531" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=1133640537449908916" height="522" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=9992430416890059" height="532" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=37225134414713643" height="532" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=53972895528682029" height="526" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=58265388932277836" height="537" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],
    "wedding-hairstyles": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=68748325787" height="714" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=4785143350609628" height="713" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=1004091679424321573" height="713" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=777363585717657105" height="714" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=14284923812168851" height="713" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=597993656806592463" height="714" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=1107252258419537087" height="714" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=1107252258419537087" height="714" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],
    "bride-wedding-dresses": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=72690981480713067" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=59250551350218572" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=95842298316148476" height="617" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=988329080703834114" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],
    "wedding-decoration": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=198932508533428865" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=26247610322787989" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=225954106299191143" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=411657222207909076" height="618" width="345" frameborder="0" scrolling="no" ></iframe>`,
    ],
    "wedding-jewellery": [
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=809522101798745696" height="437" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=65724475806179469" height="449" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=3307399720396214" height="444" width="345" frameborder="0" scrolling="no" ></iframe>`,
      `<iframe src="https://assets.pinterest.com/ext/embed.html?id=77616793573277061" height="453" width="345" frameborder="0" scrolling="no" ></iframe`,
    ],
    // Add more categories here...
  };

  const pins = pinterestData[id] || [];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 capitalize">
            {id.replace("-", " ")}
          </h1>
          <p className="text-gray-600 mt-2">
            Explore {id.replace("-", " ")} ideas on Pinterest.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {pins.map((pin, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: pin }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryLayout;
