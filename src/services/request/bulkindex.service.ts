import { client } from "../../utils/elasticsearch";
import { excelToJsonService } from "../excelToJson.service";
import { Criteria } from "../../models/Criteria";

export class bulkindexService {
    private static instance: bulkindexService;

    public static getInstance(): bulkindexService {
        if(!bulkindexService.instance) {
            bulkindexService.instance = new bulkindexService();
        }
        return bulkindexService.instance;
    }

    mapToObj = m => {
        return Array.from(m).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    };

    toJson = m => {
        return JSON.stringify(Array.from(m.entries()))
    };

    public importExcel(filename = 'Base Projet IT v5.xlsx'): void {

        const data = excelToJsonService.getInstance().processXlsxToJson(filename);
        const products_list = [];

        for (let i=0; i < Object.keys(data).length; i++) {
            const criteria: Criteria = {
                arcticOilGasExplorationCategoryAverage: data[i]['Arctic Oil & Gas Exploration Category Average'],
                arcticOilGasExplorationInvolvement: data[i]['Arctic Oil & Gas Exploration Involvement'],
                benchmarkCarbonIntensity: data[i]['Benchmark Carbon Intensity'],
                benchmarkCarbonRiskScore: data[i]['Benchmark Carbon Risk Score'],
                benchmarkEmissionsScope1: data[i]['Benchmark Emissions Scope 1'],
                benchmarkEmissionsScope2: data[i]['Benchmark Emissions Scope 2'],
                benchmarkFossilFuelInvolvement: data[i]['Benchmark Fossil Fuel Involvement'],
                carbonDate: data[i]['Carbon Date'],
                carbonExposureScore: data[i]['Carbon Exposure Score'],
                carbonExposureScoreCategoryAverage: data[i]['Carbon Exposure Score Category Average'],
                carbonExposureScorePercentRankInCategory: data[i]['Carbon Exposure Score Percent Rank in Category'],
                carbonIntensity: data[i]['Carbon Intensity'],
                carbonIntensityCategoryAverage: data[i]['Carbon Intensity Category Average'],
                carbonIntensityPercentRankInCategory: data[i]['Carbon Intensity Percent Rank in Category'],
                carbonManagementScore: data[i]['Carbon Management Score'],
                carbonManagementScoreCategoryAverage: data[i]['Carbon Management Score Category Average'],
                carbonManagementScorePercentRankInCategory: data[i]['Carbon Management Score Percent Rank in Category'],
                carbonOperationsRisk: data[i]['Carbon Operations Risk'],
                carbonOperationsRiskCategoryAverage: data[i]['Carbon Operations Risk Category Average'],
                carbonOperationsRiskPercentRankInCategory: data[i]['Carbon Operations Risk Percent Rank in Category'],
                carbonProductsServicesRisk: data[i]['Carbon Products & Services Risk'],
                carbonProductsServicesRiskCategoryAverage: data[i]['Carbon Products & Services Risk Category Average'],
                carbonProductsServicesRiskPercentRankInCategory: data[i]['Carbon Products & Services Risk Percent Rank in Category'],
                carbonRiskClassification: data[i]['Carbon Risk Classification'],
                carbonRiskScore: data[i]['Carbon Risk Score'],
                carbonRiskScoreAllFundsRank: data[i]['Carbon Risk Score All Funds Rank'],
                carbonRiskScoreCategoryAverage: data[i]['Carbon Risk Score Category Average'],
                carbonRiskScorePercentRankInCategory: data[i]['Carbon Risk Score Percent Rank in Category'],
                carbonSolutionsCategoryAverage: data[i]['Carbon Solutions Category Average'],
                carbonSolutionsInvolvement: data[i]['Carbon Solutions Involvement'],
                emissionsScope2: data[i]['Emissions Scope 2'],
                emissionsScope1: data[i]['Emissions Scope 1'],
                employsExclusionsAbortionStemCells: data[i]['Employs Exclusions - Abortion/Stem Cells'],
                employsExclusionsAdultEntertainment: data[i]['Employs Exclusions - Adult Entertainment'],
                employsExclusionsAlcohol: data[i]['Employs Exclusions - Alcohol'],
                employsExclusionsAnimalTesting: data[i]['Employs Exclusions - Animal Testing'],
                employsExclusionsControversialWeapons: data[i]['Employs Exclusions - Controversial Weapons'],
                employsExclusionsFurSpecialtyLeather: data[i]['Employs Exclusions - Fur & Specialty Leather'],
                employsExclusionsGMOS: data[i]['Employs Exclusions - GMOs'],
                employsExclusionsGambling: data[i]['Employs Exclusions - Gambling'],
                employsExclusionsMilitaryContracting: data[i]['Employs Exclusions - Military Contracting'],
                employsExclusionsNuclear: data[i]['Employs Exclusions - Nuclear'],
                employsExclusionsOther: data[i]['Employs Exclusions - Other'],
                employsExclusionsOverall: data[i]['Employs Exclusions - Overall'],
                employsExclusionsPalmOil: data[i]['Employs Exclusions - Palm Oil'],
                employsExclusionsPesticides: data[i]['Employs Exclusions - Pesticides'],
                employsExclusionsSmallArms: data[i]['Employs Exclusions - Small Arms'],
                employsExclusionsThermalCoal: data[i]['Employs Exclusions - Thermal Coal'],
                employsExclusionsTobacco: data[i]['Employs Exclusions - Tobacco'],
                employsExclusionsUsesNormsBasedScreening: data[i]['Employs Exclusions - Uses Norms-Based Screening'],
                environmentalGlobalCategoryAverage: data[i]['Environmental Global Category Average'],
                environmentalRiskAbsoluteRankInGlobalCategory: data[i]['Environmental Risk Absolute Rank in Global Category'],
                environmentalRiskPercentRankInGlobalCategory: data[i]['Environmental Risk Percent Rank in Global Category'],
                environmentalRiskScoreVsGlobalCategory: data[i]['Environmental Risk Score vs. Global Category'],
                fossilFuelCategoryAverage: data[i]['Fossil Fuel Category Average'],
                fossilFuelInvolvement: data[i]['Fossil Fuel Involvement'],
                governanceGlobalCategoryAverage: data[i]['Governance Global Category Average'],
                governanceRiskAbsoluteRankInGlobalCategory: data[i]['Governance Risk Absolute Rank in Global Category'],
                governanceRiskPercentRankInGlobalCategory: data[i]['Governance Risk Percent Rank in Global Category'],
                governanceRiskScoreVsGlobalCategory: data[i]['Governance Risk Score vs. Global Category'],
                greenTransportationCategoryAverage: data[i]['Green Transportation Category Average'],
                greenTransportationInvolvement: data[i]['Green Transportation Involvement'],
                highestCarbonRiskScoreCategory: data[i]['Highest Carbon Risk Score Category'],
                highestFossilFuelCategory: data[i]['Highest Fossil Fuel Category'],
                historicalSustainabilityAbsoluteRankInGlobalCategory: data[i]['Historical Sustainability Absolute Rank in Global Category'],
                historicalSustainabilityPercentRankInGlobalCategory: data[i]['Historical Sustainability Percent Rank in Global Category'],
                historicalSustainabilityScore: data[i]['Historical Sustainability Score'],
                historicalSustainabilityScoreGlobalCategoryAverage: data[i]['Historical Sustainability Score Global Category Average'],
                lowCarbonDesignation: data[i]['Low Carbon Designation'],
                lowestCarbonRiskScoreCategory: data[i]['Lowest Carbon Risk Score Category'],
                lowestFossilFuelCategory: data[i]['Lowest Fossil Fuel Category'],
                morningstarSustainabilityRating: data[i]['Morningstar Sustainability Rating'],
                numberOfFundsInGlobalCategory: data[i]['Number of Funds in Global Category - Sustainability'],
                numberOfSecuritiesNotScoredControversy: data[i]['Number of Securities Not Scored - Controversy'],
                numberOfSecuritiesNotScoredESG: data[i]['Number of Securities Not Scored - ESG'],
                numberOfSecuritiesScoredControversy: data[i]['Number of Securities Scored - Controversy'],
                numberOfSecuritiesScoredESG: data[i]['Number of Securities Scored - ESG'],
                oilGasGenerationCategoryAverage: data[i]['Oil & Gas Generation Category Average'],
                oilGasGenerationInvolvement: data[i]['Oil & Gas Generation Involvement'],
                oilGasProductionCategoryAverage: data[i]['Oil & Gas Production Category Average'],
                oilGasProductionInvolvement: data[i]['Oil & Gas Production Involvement'],
                oilGasProductsServiceInvolvement: data[i]['Oil & Gas Products & Service Involvement'],
                oilGasProductsServicesCategoryAverage: data[i]['Oil & Gas Products & Services Category Average'],
                oilSandsExtractionCategoryAverage: data[i]['Oil Sands Extraction Category Average'],
                oilSandsExtractionInvolvement: data[i]['Oil Sands Extraction Involvement'],
                percentAUMCoveredCarbon: data[i]['Percent AUM Covered - Carbon'],
                percentOfAUMCoveredControversy: data[i]['Percent of AUM Covered - Controversy'],
                percentOfAUMCoveredESG: data[i]['Percent of AUM Covered - ESG'],
                percentOfAUMCoveredESGPillars: data[i]['Percent of AUM Covered - ESG Pillars'],
                percentOfAUMWithHighCarbonRisk: data[i]['Percent of AUM with High Carbon Risk'],
                percentOfAUMWithHighControversies: data[i]['Percent of AUM with High Controversies'],
                percentOfAUMWithHighESGRiskScores: data[i]['Percent of AUM with High ESG Risk Scores'],
                percentOfAUMWithLowCarbonRisk: data[i]['Percent of AUM with Low Carbon Risk'],
                percentOfAUMWithLowControveries: data[i]['Percent of AUM with Low Controveries'],
                percentOfAUMWithLowESGRiskScores: data[i]['Percent of AUM with Low ESG Risk Scores'],
                percentOfAUMWithMediumCarbonRisk: data[i]['Percent of AUM with Medium Carbon Risk'],
                percentOfAUMWithMediumESGRiskScores: data[i]['Percent of AUM with Medium ESG Risk Scores'],
                percentOfAUMWithModerateControversies: data[i]['Percent of AUM with Moderate Controversies'],
                percentOfAUMWithNULLESGRiskScores: data[i]['Percent of AUM with NULL ESG Risk Scores'],
                percentOfAUMWithNegligibleCarbonRisk: data[i]['Percent of AUM with Negligible Carbon Risk'],
                percentOfAUMWithNegligibleESGRiskScores: data[i]['Percent of AUM with Negligible ESG Risk Scores'],
                percentOfAUMWithNoControversies: data[i]['Percent of AUM with No Controversies'],
                percentOfAUMWithSevereCarbonRisk: data[i]['Percent of AUM with Severe Carbon Risk'],
                percentOfAUMWithSevereControversies: data[i]['Percent of AUM with Severe Controversies'],
                percentOfAUMWithSevereESGRiskScores: data[i]['Percent of AUM with Severe ESG Risk Scores'],
                percentOfAUMWithSignificantControversies: data[i]['Percent of AUM with Significant Controversies'],
                portfolioCarbonIntensityVsBenchmark: data[i]['Portfolio Carbon Intensity vs. Benchmark'],
                portfolioCarbonRiskScoreVsBenchmark: data[i]['Portfolio Carbon Risk Score vs. Benchmark'],
                portfolioDate: data[i]['Portfolio Date'],
                portfolioESGManagedRiskScore: data[i]['Portfolio ESG Managed Risk Score'],
                portfolioESGRiskExposureScore: data[i]['Portfolio ESG Risk Exposure Score'],
                portfolioEmissionsVsBenchmarkScope1: data[i]['Portfolio Emissions vs. Benchmark Scope 1'],
                portfolioEmissionsVsBenchmarkScope2: data[i]['Portfolio Emissions vs. Benchmark Scope 2'],
                portfolioEnvironmentalScore: data[i]['Portfolio Environmental Score'],
                portfolioGovernanceScore: data[i]['Portfolio Governance Score'],
                portfolioSocialScore: data[i]['Portfolio Social Score'],
                portfolioSustainabilityScore: data[i]['Portfolio Sustainability Score'],
                productInvolvementAbortiveContraceptivesStemCell: data[i]['Product Involvement % - Abortive/Contraceptives/Stem Cell'],
                productInvolvementAdultEntertainment: data[i]['Product Involvement % - Adult Entertainment'],
                productInvolvementAlcohol: data[i]['Product Involvement % - Alcohol'],
                productInvolvementAnimalTesting: data[i]['Product Involvement % - Animal Testing'],
                productInvolvementCatAvgAbortiveContraceptivesStemCell: data[i]['Product Involvement Cat Avg % - Abortive/Contraceptives/Stem Cell'],
                productInvolvementCatAvgAdultEntertainment: data[i]['Product Involvement Cat Avg % - Adult Entertainment'],
                productInvolvementCatAvgAlcohol: data[i]['Product Involvement Cat Avg % - Alcohol'],
                productInvolvementCatAvgAnimalTesting: data[i]['Product Involvement Cat Avg % - Animal Testing'],
                productInvolvementCatAvgControversialWeapons: data[i]['Product Involvement Cat Avg % - Controversial Weapons'],
                productInvolvementCatAvgFurSpecialtyLeather: data[i]['Product Involvement Cat Avg % - Fur & Specialty Leather'],
                productInvolvementCatAvgGMO: data[i]['Product Involvement Cat Avg % - GMO'],
                productInvolvementCatAvgGambling: data[i]['Product Involvement Cat Avg % - Gambling'],
                productInvolvementCatAvgMilitaryContracting: data[i]['Product Involvement Cat Avg % - Military Contracting'],
                productInvolvementCatAvgNuclear: data[i]['Product Involvement Cat Avg % - Nuclear'],
                productInvolvementCatAvgPalmOil: data[i]['Product Involvement Cat Avg % - Palm Oil'],
                productInvolvementCatAvgPesticides: data[i]['Product Involvement Cat Avg % - Pesticides'],
                productInvolvementCatAvgSmallArms: data[i]['Product Involvement Cat Avg % - Small Arms'],
                productInvolvementCatAvgThermalCoal: data[i]['Product Involvement Cat Avg % - Thermal Coal'],
                productInvolvementCatAvgTobacco: data[i]['Product Involvement Cat Avg % - Tobacco'],
                productInvolvementControversialWeapons: data[i]['Product Involvement % - Controversial Weapons'],
                productInvolvementFurSpecialtyLeather: data[i]['Product Involvement % - Fur & Specialty Leather'],
                productInvolvementGMO: data[i]['Product Involvement % - GMO'],
                productInvolvementGambling: data[i]['Product Involvement % - Gambling'],
                productInvolvementMilitaryContracting: data[i]['Product Involvement % - Military Contracting'],
                productInvolvementNuclear: data[i]['Product Involvement % - Nuclear'],
                productInvolvementOfHoldingsAbortiveContraceptivesStemCell: data[i]['Product Involvement # of Holdings - Abortive/Contraceptives/Stem Cell'],
                productInvolvementOfHoldingsAdultEntertainment: data[i]['Product Involvement # of Holdings - Adult Entertainment'],
                productInvolvementOfHoldingsAlcohol: data[i]['Product Involvement # of Holdings - Alcohol'],
                productInvolvementOfHoldingsAnimalTesting: data[i]['Product Involvement # of Holdings - Animal Testing'],
                productInvolvementOfHoldingsControversialWeapons: data[i]['Product Involvement # of Holdings - Controversial Weapons'],
                productInvolvementOfHoldingsFurSpecialtyLeather: data[i]['Product Involvement # of Holdings - Fur & Specialty Leather'],
                productInvolvementOfHoldingsGMO: data[i]['Product Involvement # of Holdings - GMO'],
                productInvolvementOfHoldingsGambling: data[i]['Product Involvement # of Holdings - Gambling'],
                productInvolvementOfHoldingsMilitaryContracting: data[i]['Product Involvement # of Holdings - Military Contracting'],
                productInvolvementOfHoldingsNuclear: data[i]['Product Involvement # of Holdings - Nuclear'],
                productInvolvementOfHoldingsPalmOil: data[i]['Product Involvement # of Holdings - Palm Oil'],
                productInvolvementOfHoldingsPesticides: data[i]['Product Involvement # of Holdings - Pesticides'],
                productInvolvementOfHoldingsSmallArms: data[i]['Product Involvement # of Holdings - Small Arms'],
                productInvolvementOfHoldingsThermalCoal: data[i]['Product Involvement # of Holdings - Thermal Coal'],
                productInvolvementOfHoldingsTobacco: data[i]['Product Involvement # of Holdings - Tobacco'],
                productInvolvementPalmOil: data[i]['Product Involvement % - Palm Oil'],
                productInvolvementPesticides: data[i]['Product Involvement % - Pesticides'],
                productInvolvementSmallArms: data[i]['Product Involvement % - Small Arms'],
                productInvolvementThermalCoal: data[i]['Product Involvement % - Thermal Coal'],
                productInvolvementTobacco: data[i]['Product Involvement % - Tobacco'],
                renewableEnergyProductionCategoryAverage: data[i]['Renewable Energy Production Category Average'],
                renewableEnergyProductionInvolvement: data[i]['Renewable Energy Production Involvement'],
                renewableEnergySupportingProductsServicesCategoryAverage: data[i]['Renewable Energy Supporting Products & Services Category Average'],
                renewableEnergySupportingProductsServicesInvolvement: data[i]['Renewable Energy Supporting Products & Services Involvement'],
                socialGlobalCategoryAverage: data[i]['Social Global Category Average'],
                socialRiskAbsoluteRankInGlobalCategory: data[i]['Social Risk Absolute Rank in Global Category'],
                socialRiskPercentRankInGlobalCategory: data[i]['Social Risk Percent Rank in Global Category'],
                socialRiskScoreVsGlobalCategory: data[i]['Social Risk Score vs. Global Category'],
                strandedAssetsRisk: data[i]['Stranded Assets Risk'],
                strandedAssetsRiskCategoryAverage: data[i]['Stranded Assets Risk Category Average'],
                strandedAssetsRiskPercentRankInCategory: data[i]['Stranded Assets Risk Percent Rank in Category'],
                sustainabilityAbsoluteRankInGlobalCategory: data[i]['Sustainability Absolute Rank in Global Category'],
                sustainabilityGlobalCategoryAverage: data[i]['Sustainability Global Category Average'],
                sustainabilityPercentRankInGlobalCategory: data[i]['Sustainability Percent Rank in Global Category'],
                sustainabilityRatingDate: data[i]['Sustainability Rating Date'],
                sustainableInvestmentCommunityDevelopment: data[i]['Sustainable Investment - Community Development'],
                sustainableInvestmentESGEngagement: data[i]['Sustainable Investment - ESG Engagement'],
                sustainableInvestmentESGFundOverall: data[i]['Sustainable Investment - ESG Fund Overall'],
                sustainableInvestmentESGIncorporation: data[i]['Sustainable Investment - ESG Incorporation'],
                sustainableInvestmentEnvironmental: data[i]['Sustainable Investment - Environmental'],
                sustainableInvestmentEnvironmentalSectorOverall: data[i]['Sustainable Investment - Environmental Sector Overall'],
                sustainableInvestmentGenderDiversity: data[i]['Sustainable Investment - Gender & Diversity'],
                sustainableInvestmentGeneralEnvironmentalSector: data[i]['Sustainable Investment - General Environmental Sector'],
                sustainableInvestmentImpactFundOverall: data[i]['Sustainable Investment - Impact Fund Overall'],
                sustainableInvestmentLowCarbonFossilFuelFree: data[i]['Sustainable Investment - Low Carbon/Fossil-Fuel Free'],
                sustainableInvestmentOtherImpactThemes: data[i]['Sustainable Investment - Other Impact Themes'],
                sustainableInvestmentOverall: data[i]['Sustainable Investment - Overall'],
                sustainableInvestmentRenewableEnergy: data[i]['Sustainable Investment - Renewable Energy'],
                sustainableInvestmentWaterFocused: data[i]['Sustainable Investment - Water-Focused'],
                the12MonthAverageBenchmarkCarbonRiskScore: data[i]['12 Month Average Benchmark Carbon Risk Score'],
                the12MonthAverageBenchmarkFossilFuelInvolvement: data[i]['12 Month Average Benchmark Fossil Fuel Involvement'],
                the12MonthAverageCarbonRiskCategoryAverage: data[i]['12 Month Average Carbon Risk Category Average'],
                the12MonthAverageCarbonRiskPercentRankInCategory: data[i]['12 Month Average Carbon Risk Percent Rank in Category'],
                the12MonthAverageCarbonRiskScore: data[i]['12 Month Average Carbon Risk Score'],
                the12MonthAverageFossilFuelCategoryAverage: data[i]['12 Month Average Fossil Fuel Category Average'],
                the12MonthAverageFossilFuelExposure: data[i]['12 Month Average Fossil Fuel Exposure'],
                the12MonthAverageHighestCarbonRiskScoreCategory: data[i]['12 Month Average Highest Carbon Risk Score Category'],
                the12MonthAverageHighestFossilFuelInvolvementCategory: data[i]['12 Month Average Highest Fossil Fuel Involvement Category'],
                the12MonthAverageLowestCarbonRiskScoreCategory: data[i]['12 Month Average Lowest Carbon Risk Score Category'],
                the12MonthAverageLowestFossilFuelInvolvementCategory: data[i]['12 Month Average Lowest Fossil Fuel Involvement Category'],
                thermalCoalExtractionCategoryAverage: data[i]['Thermal Coal Extraction Category Average'],
                thermalCoalExtractionInvolvement: data[i]['Thermal Coal Extraction Involvement'],
                thermalCoalPowerGenerationCategoryAverage: data[i]['Thermal Coal Power Generation Category Average'],
                thermalCoalPowerGenerationInvolvement: data[i]['Thermal Coal Power Generation Involvement']
            };

            const dict_products : Map<String, String> = new Map<String, String>([
                ["type","product"],
                ["isincode", data[i]['ISIN']],
                ["productname", data[i]['Name']],
                ["ongoingcharge", data[i]['KIID Ongoing Charge']],
                ["category", data[i]['Global Category']],
                ["criteria", criteria]
            ]);
            products_list.push({ update: { _index: 'scala', _type: 'database'}});
            products_list.push(this.mapToObj(dict_products));
        }

       client.bulk({
            index: 'scala',
            type: 'database',
            body: products_list
        }, (err, response) => {
            if (err){
                console.log("Servor error: ", err);
            }
            else if (response.body.items[0].index.status == 201){
                console.log('>>>> Bulk index done.');
            }
            else {
                console.log('Malformed Exception.')
            }
        });


    }
}
