import { CropCalendarIcon, ECommerceIcon, ExploreServiceIcon, InsuranceIcon, IrrigationIcon, KhetiCenterIcon, SoilHealthIcon } from "@/components/basic/pages/explorePage/icon";
import { ClockIcon, LeafIcon, SupportIcon, VerifyIcon } from "@/components/icons";
import { FeaturedTool } from "@/models/commonTypes";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// --- Home / Smart Tools Images ---
const fertilizerImg = require("@/assets/images/static/home/fertilizer.png")
const sprayImg = require("@/assets/images/static/home/spray.png")
const yieldImg = require("@/assets/images/static/home/yield.png")
const weatherImg = require("@/assets/images/static/home/weatherMonitoring.png")
const mandiImg = require("@/assets/images/static/home/mandibhaav.png")

// --- Explore Images ---
const fertilizerImg1 = require("@/assets/images/static/explore/fertilizerCalculator.png")
const sprayImg1 = require("@/assets/images/static/explore/sprayCalculator.png")
const yieldImg1 = require("@/assets/images/static/explore/yield-predictor.png")
const weatherImg1 = require("@/assets/images/static/weather/partial-cloudy.png")

const faqsImg = require("@/assets/images/static/explore/faqs.png")
const govtSchemeImg = require("@/assets/images/static/explore/governmentScheme.png")
const helplineImg = require("@/assets/images/static/explore/helpline.png")
const insuranceImg = require("@/assets/images/static/explore/insurance.png")
const knowledgeCenterImg = require("@/assets/images/static/explore/knowledgeCenter.png")
const lendingImg = require("@/assets/images/static/explore/lending.png")
const rewardsImg = require("@/assets/images/static/explore/rewards.png")
const subscriptionImg = require("@/assets/images/static/explore/subscriptionService.png")
const videoTutorialsImg = require("@/assets/images/static/explore/videoTutorials.png")
const ecomImg = require("@/assets/images/static/explore/ecom.png")


const images = {
    fertilizerCalculator: { home: fertilizerImg, explore: fertilizerImg1 },
    sprayCalculator: { home: sprayImg, explore: sprayImg1 },
    yieldPredictor: { home: yieldImg, explore: yieldImg1 },
    weatherForecast: { home: weatherImg, explore: weatherImg1 },
    mandiRate: { home: mandiImg, explore: mandiImg },
    faqs: faqsImg,
    governmentScheme: govtSchemeImg,
    helpline: helplineImg,
    insurance: insuranceImg,
    knowledgeCenter: knowledgeCenterImg,
    lending: lendingImg,
    rewards: rewardsImg,
    subscriptionService: subscriptionImg,
    videoTutorials: videoTutorialsImg,
    eCom: ecomImg,
} as const;

export default function useAppText() {
    const { t } = useTranslation();

    return useMemo(() => {
        const mandiRate: FeaturedTool = {
            id: "mandiRate",
            label: t('explore.mandi.label', 'Know'),
            title: t('explore.mandi.title', 'Mandi Rate'),
            description: t('explore.mandi.description'),
            link: "/mandiRate",
            img: images.mandiRate.home,
        };

        const fertilizerCalculator: FeaturedTool = {
            id: "fertilizerCalculator",
            label: t('explore.fertilizerCalculator.label', 'Calculate'),
            title: t('explore.fertilizerCalculator.title', 'Fertilizer Calculator'),
            description: t('explore.fertilizerCalculator.description'),
            link: "/fertilizerCalculator",
            img: images.fertilizerCalculator.home,
            img1: images.fertilizerCalculator.explore,
        };

        const sprayCalculator: FeaturedTool = {
            id: "sprayCalculator",
            label: t('explore.sprayCalculator.label', 'Calculate'),
            title: t('explore.sprayCalculator.title', 'Spray Calculator'),
            description: t('explore.sprayCalculator.description'),
            link: "/sprayCalculator",
            img: images.sprayCalculator.home,
            img1: images.sprayCalculator.explore,
        };

        const yieldPredictor: FeaturedTool = {
            id: "yieldPredictor",
            label: t('explore.yieldPredictor.label', 'Calculate'),
            title: t('explore.yieldPredictor.title', 'Yield Predictor'),
            description: t('explore.yieldPredictor.description'),
            link: "/yieldPredictor",
            img: images.yieldPredictor.home,
            img1: images.yieldPredictor.explore,
        };

        const weatherForecast: FeaturedTool = {
            id: "weatherForecast",
            label: t('explore.weatherPrediction.label', 'Monitor'),
            title: t('explore.weatherPrediction.title', 'Weather Forecast'),
            description: t('explore.weatherPrediction.description'),
            link: "/weather",
            img: images.weatherForecast.home,
            img1: images.weatherForecast.explore,
        };

        const ecommerce: FeaturedTool = {
            id: "ecommerce",
            title: t('explore.ecommerce.title'),
            description: t('explore.ecommerce.description'),
            link: "/eCom",
            icon: ECommerceIcon,
            img: images.eCom,
        }
        const insurance: FeaturedTool = {
            id: "insurance",
            title: t('explore.insurance.title'),
            description: t('explore.insurance.description'),
            // link: "",
            img: images.insurance,
            icon: InsuranceIcon

        }
        const sprayService: FeaturedTool = {
            id: "sprayService",
            title: t('explore.sprayService.title'),
            description: t('explore.sprayService.description'),
            link: "/sprays",
            icon: ExploreServiceIcon,
            img: images.helpline
        }
        const soilHealth: FeaturedTool = {
            id: "soilHealth",
            title: t('explore.soilHealth.title'),
            description: t('explore.soilHealth.description'),
            // link: "",
            icon: SoilHealthIcon
        }
        const cropCalendar: FeaturedTool = {
            id: "cropCalendar",
            title: t('explore.cropCalendar.title'),
            description: t('explore.cropCalendar.description'),
            // link: "/cropCalendar",
            icon: CropCalendarIcon
        }
        const irrigation: FeaturedTool = {
            id: "irrigation",
            title: t('explore.irrigation.title'),
            description: t('explore.irrigation.description'),
            // link: "/irrigation",
            icon: IrrigationIcon
        }
        const khetiCenter: FeaturedTool = {
            id: "khetiCenter",
            title: t('explore.khetiCenter.title'),
            description: t('explore.khetiCenter.description'),
            // link: "/khetiCenter",
            icon: KhetiCenterIcon
        }
        const knowledgeCenter: FeaturedTool = {
            id: "knowledgeCenter",
            title: t('explore.knowledgeCenter', 'Knowledge Center'),
            // link: "/knowledgeCenter",
            img: images.knowledgeCenter,
        }
        const subscriptionServices: FeaturedTool = {
            id: "subscriptionServices",
            title: t('explore.subscriptionServices', 'Subscription Services'),
            link: "/mySubscription",
            img: images.subscriptionService,
        }
        const governmentSchemes: FeaturedTool = {
            id: "governmentSchemes",
            title: t('explore.governmentSchemes', 'Government Schemes'),
            // link: "/governmentSchemes",
            img: images.governmentScheme,
        }
        const lending: FeaturedTool = {
            id: "lending",
            title: t('explore.lending', 'Lending'),
            // link: "/lending",
            img: images.lending,
        }
        const rewards: FeaturedTool = {
            id: "rewards",
            title: t('explore.rewards', 'Rewards'),
            link: "/rewards",
            img: images.rewards,
        }
        const videoTutorials: FeaturedTool = {
            id: "videoTutorials",
            title: t('explore.videoTutorials', 'Video Tutorials'),
            // link: "/videoTutorials",
            img: images.videoTutorials,
        }
        const faqs: FeaturedTool = {
            id: "faqs",
            title: t('explore.faqs', 'FAQs'),
            link: "/support",
            img: images.faqs,
        }
        const helpline: FeaturedTool = {
            id: "helpline",
            title: t('explore.helpline', 'Helpline'),
            link: "/support",
            img: images.helpline,
        }

        // Full Explore object
        const explore = {
            title: t('explore.title', 'Explore'),
            tagline: t('explore.tagline', 'Quick Links'),
            description: t('explore.description', 'All services and tools at your fingertips'),
            smartToolsTitle: t('explore.smartToolsTitle'),
            smartToolsDesc: t('explore.smartToolsDesc'),
            featuresOnloading: t('explore.featuresOnloading'),
            otheruseFulLinks: t('explore.otheruseFulLinks', 'Other Useful Links'),
            comingSoon: t('explore.comingSoon', 'Coming Soon'),

            // advisory ________________
            cropAdvisory: t('explore.cropAdvisory', 'Crop Advisory'),
            sprayAdvisory: t('explore.sprayAdvisory', 'Spray Advisory'),
            pestAdvisory: t('explore.pestAdvisory', 'Pest & Diseases Advisory'),
            smartFarmerCenter: t('explore.smartFarmerCenter', 'Smart Farmer Center'),
            farmerChaupal: t('explore.farmerChaupal', 'Farmer Chaupal'),
            farmerConnect: t('explore.farmerConnect', 'Farmer Connect (FPO, Buyers)'),

            // tools ________________
            yieldPredictor,
            sprayCalculator,
            fertilizerCalculator,
            weatherForecast,
            mandiRate,

            // services ________________
            ecommerce,
            insurance,
            sprayService,
            soilHealth,
            cropCalendar,
            irrigation,
            khetiCenter,

            // otherLinks ________________
            knowledgeCenter,
            subscriptionServices,
            governmentSchemes,
            lending,
            rewards,
            videoTutorials,
            faqs,
            helpline
        };



        const droneSpray: FeaturedTool = {
            id: 'tractor-spray',
            title: t('servicesHome.droneSpray.title'),
            description: t('servicesHome.tractorSpray.description'),
            img: require('@/assets/images/static/services/droneSpray.png'),
            link: '/sprays/droneSprays'
            // route: '/sprays/tractorSprays'
        }
        const tractorSpray: FeaturedTool = {
            id: 'tractor-spray',
            title: t('servicesHome.tractorSpray.title'),
            description: t('servicesHome.tractorSpray.description'),
            img: require('@/assets/images/static/services/tractorSpray.png'),
            // route: '/sprays/tractorSprays'
        }
        const boomSpray: FeaturedTool = {
            id: 'boom-spray',
            title: t('servicesHome.boomSpray.title'),
            description: t('servicesHome.boomSpray.description'),
            img: require('@/assets/images/static/services/boomSpray.png'),
            // route: '/sprays/boomSprays'
        }
        const manualSpray: FeaturedTool = {
            id: 'manual-spray',
            title: t('servicesHome.manualSpray.title'),
            description: t('servicesHome.manualSpray.description'),
            img: require('@/assets/images/static/services/manualSpray.png'),
            // route: '/sprays/manualSprays'
        }


        const serviceCtas: FeaturedTool[] = [
            {
                id: 'verified',
                icon: VerifyIcon,
                title: t('servicesHome.ctas.verified'),
                description: t('servicesHome.ctas.verifiedDes'),
            },
            {
                id: 'timeSaving',
                icon: ClockIcon,
                title: t('servicesHome.ctas.timeSaving'),
                description: t('servicesHome.ctas.timeSavingDes'),
            },
            {
                id: 'safeAndReliable',
                icon: LeafIcon,
                title: t('servicesHome.ctas.safeAndReliable'),
                description: t('servicesHome.ctas.safeAndReliableDes'),
            },
            {
                id: 'expertSupport',
                icon: SupportIcon,
                title: t('servicesHome.ctas.expertSupport'),
                description: t('servicesHome.ctas.expertSupportDes'),
            },
        ]



        const services = {
            droneSpray,
            tractorSpray, boomSpray, manualSpray
        }

        return {
            explore,
            services,
            serviceCtas
        };
    }, [t])
}