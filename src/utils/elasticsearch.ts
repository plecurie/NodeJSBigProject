import * as elasticsearch from '@elastic/elasticsearch'
import { ES_URL } from "./constants";
import {bulkindexService} from "../services/request/bulkindex.service";

export const index = 'scala';
export const type = 'database';

export const client = new elasticsearch.Client({
    node: [ES_URL],
    headers: { 'Content-Type': 'application/json'},
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart:true
});

export async function checkConnection() {
    let es_started = false;

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    while(!es_started) {
        await delay(10000);
        try {
            await client.cluster.health( {});
            es_started = true;
            console.log(">>>> Elasticsearch started on ", ES_URL);
        } catch(err) {
            console.log(">>>> Connection to Elasticsearch failed, retrying... ");
        }
    }
    await resetIndex()
}

export async function resetIndex () {
    client.indices.exists({ index }, async (err, response) => {
        if (err)
            console.log("ERROR", err);
        if (response.body) {
            await client.indices.delete({index});
        }
        await client.indices.create({ index });
        await putMapping()
    });
}
async function putMapping () {
    const schema = {
        "birthdate" : {
            "type" : "date",
            "cql_collection" : "singleton"
        },
        "category" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "criteria" : {
            "type" : "nested",
            "cql_collection" : "singleton",
            "cql_udt_name" : "database_criteria",
            "properties" : {
                "arcticOilGasExplorationCategoryAverage" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "arcticOilGasExplorationInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "benchmarkCarbonIntensity" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "benchmarkCarbonRiskScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "benchmarkEmissionsScope1" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "benchmarkEmissionsScope2" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "benchmarkFossilFuelInvolvement" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonDate" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonExposureScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonExposureScoreCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonExposureScorePercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonIntensity" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonIntensityCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonIntensityPercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonManagementScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonManagementScoreCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonManagementScorePercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonOperationsRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonOperationsRiskCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonOperationsRiskPercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonProductsServicesRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonProductsServicesRiskCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonProductsServicesRiskPercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonRiskClassification" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "carbonRiskScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonRiskScoreAllFundsRank" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonRiskScoreCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonRiskScorePercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "carbonSolutionsCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "carbonSolutionsInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "emissionsScope1" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "emissionsScope2" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsAbortionStemCells" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsAdultEntertainment" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsAlcohol" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsAnimalTesting" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsControversialWeapons" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsFurSpecialtyLeather" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsGMOS" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsGambling" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsMilitaryContracting" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsNuclear" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsOther" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsOverall" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsPalmOil" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsPesticides" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsSmallArms" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsThermalCoal" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsTobacco" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "employsExclusionsUsesNormsBasedScreening" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "environmentalGlobalCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "environmentalRiskAbsoluteRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "environmentalRiskPercentRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "environmentalRiskScoreVsGlobalCategory" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "fossilFuelCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "fossilFuelInvolvement" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "governanceGlobalCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "governanceRiskAbsoluteRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "governanceRiskPercentRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "governanceRiskScoreVsGlobalCategory" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "greenTransportationCategoryAverage" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "greenTransportationInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "highestCarbonRiskScoreCategory" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "highestFossilFuelCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "historicalSustainabilityAbsoluteRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "historicalSustainabilityPercentRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "historicalSustainabilityScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "historicalSustainabilityScoreGlobalCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "lowCarbonDesignation" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "lowestCarbonRiskScoreCategory" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "lowestFossilFuelCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "morningstarSustainabilityRating" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "numberOfFundsInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "numberOfSecuritiesNotScoredControversy" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "numberOfSecuritiesNotScoredESG" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "numberOfSecuritiesScoredControversy" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "numberOfSecuritiesScoredESG" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "oilGasGenerationCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilGasGenerationInvolvement" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilGasProductionCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilGasProductionInvolvement" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilGasProductsServiceInvolvement" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilGasProductsServicesCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilSandsExtractionCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "oilSandsExtractionInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "percentAUMCoveredCarbon" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMCoveredControversy" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMCoveredESG" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMCoveredESGPillars" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithHighCarbonRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithHighControversies" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithHighESGRiskScores" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithLowCarbonRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithLowControveries" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithLowESGRiskScores" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithMediumCarbonRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithMediumESGRiskScores" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithModerateControversies" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithNULLESGRiskScores" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithNegligibleCarbonRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithNegligibleESGRiskScores" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithNoControversies" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithSevereCarbonRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithSevereControversies" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithSevereESGRiskScores" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "percentOfAUMWithSignificantControversies" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioCarbonIntensityVsBenchmark" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioCarbonRiskScoreVsBenchmark" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioDate" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "portfolioESGManagedRiskScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioESGRiskExposureScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioEmissionsVsBenchmarkScope1" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioEmissionsVsBenchmarkScope2" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioEnvironmentalScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioGovernanceScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioSocialScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "portfolioSustainabilityScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementAbortiveContraceptivesStemCell" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementAdultEntertainment" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementAlcohol" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementAnimalTesting" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgAbortiveContraceptivesStemCell" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgAdultEntertainment" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgAlcohol" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgAnimalTesting" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgControversialWeapons" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgFurSpecialtyLeather" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgGMO" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgGambling" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgMilitaryContracting" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgNuclear" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgPalmOil" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgPesticides" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgSmallArms" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgThermalCoal" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementCatAvgTobacco" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementControversialWeapons" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementFurSpecialtyLeather" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementGMO" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementGambling" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementMilitaryContracting" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementNuclear" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsAbortiveContraceptivesStemCell" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsAdultEntertainment" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsAlcohol" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsAnimalTesting" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsControversialWeapons" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsFurSpecialtyLeather" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsGMO" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsGambling" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsMilitaryContracting" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsNuclear" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsPalmOil" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsPesticides" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsSmallArms" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsThermalCoal" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementOfHoldingsTobacco" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementPalmOil" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementPesticides" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementSmallArms" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementThermalCoal" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "productInvolvementTobacco" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "renewableEnergyProductionCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "renewableEnergyProductionInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "renewableEnergySupportingProductsServicesCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "renewableEnergySupportingProductsServicesInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "socialGlobalCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "socialRiskAbsoluteRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "socialRiskPercentRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "socialRiskScoreVsGlobalCategory" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "strandedAssetsRisk" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "strandedAssetsRiskCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "strandedAssetsRiskPercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "sustainabilityAbsoluteRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "sustainabilityGlobalCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "sustainabilityPercentRankInGlobalCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "sustainabilityRatingDate" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentCommunityDevelopment" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentESGEngagement" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentESGFundOverall" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentESGIncorporation" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentEnvironmental" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentEnvironmentalSectorOverall" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentGenderDiversity" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentGeneralEnvironmentalSector" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentImpactFundOverall" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentLowCarbonFossilFuelFree" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentOtherImpactThemes" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentOverall" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentRenewableEnergy" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "sustainableInvestmentWaterFocused" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageBenchmarkCarbonRiskScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageBenchmarkFossilFuelInvolvement" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageCarbonRiskCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageCarbonRiskPercentRankInCategory" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageCarbonRiskScore" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageFossilFuelCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageFossilFuelExposure" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageHighestCarbonRiskScoreCategory" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageHighestFossilFuelInvolvementCategory" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageLowestCarbonRiskScoreCategory" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "the12MonthAverageLowestFossilFuelInvolvementCategory" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "thermalCoalExtractionCategoryAverage" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "thermalCoalExtractionInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                },
                "thermalCoalPowerGenerationCategoryAverage" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "thermalCoalPowerGenerationInvolvement" : {
                    "type" : "long",
                    "cql_collection" : "singleton"
                }
            }
        },
        "email" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "firstname" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "isincode" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "lastname" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "ongoingcharge" : {
            "type" : "float",
            "cql_collection" : "singleton"
        },
        "password" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "productname" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "products" : {
            "type" : "nested",
            "cql_collection" : "singleton",
            "cql_udt_name" : "database_products",
            "properties" : {
                "category" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "criteria" : {
                    "type" : "nested",
                    "cql_collection" : "singleton",
                    "cql_udt_name" : "database_criteria",
                    "properties" : {
                        "arcticOilGasExplorationCategoryAverage" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "arcticOilGasExplorationInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "benchmarkCarbonIntensity" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "benchmarkCarbonRiskScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "benchmarkEmissionsScope1" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "benchmarkEmissionsScope2" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "benchmarkFossilFuelInvolvement" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonDate" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonExposureScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonExposureScoreCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonExposureScorePercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonIntensity" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonIntensityCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonIntensityPercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonManagementScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonManagementScoreCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonManagementScorePercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonOperationsRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonOperationsRiskCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonOperationsRiskPercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonProductsServicesRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonProductsServicesRiskCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonProductsServicesRiskPercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonRiskClassification" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "carbonRiskScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonRiskScoreAllFundsRank" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonRiskScoreCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonRiskScorePercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "carbonSolutionsCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "carbonSolutionsInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "emissionsScope1" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "emissionsScope2" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsAbortionStemCells" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsAdultEntertainment" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsAlcohol" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsAnimalTesting" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsControversialWeapons" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsFurSpecialtyLeather" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsGMOS" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsGambling" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsMilitaryContracting" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsNuclear" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsOther" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsOverall" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsPalmOil" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsPesticides" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsSmallArms" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsThermalCoal" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsTobacco" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "employsExclusionsUsesNormsBasedScreening" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "environmentalGlobalCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "environmentalRiskAbsoluteRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "environmentalRiskPercentRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "environmentalRiskScoreVsGlobalCategory" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "fossilFuelCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "fossilFuelInvolvement" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "governanceGlobalCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "governanceRiskAbsoluteRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "governanceRiskPercentRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "governanceRiskScoreVsGlobalCategory" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "greenTransportationCategoryAverage" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "greenTransportationInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "highestCarbonRiskScoreCategory" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "highestFossilFuelCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "historicalSustainabilityAbsoluteRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "historicalSustainabilityPercentRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "historicalSustainabilityScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "historicalSustainabilityScoreGlobalCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "lowCarbonDesignation" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "lowestCarbonRiskScoreCategory" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "lowestFossilFuelCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "morningstarSustainabilityRating" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "numberOfFundsInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "numberOfSecuritiesNotScoredControversy" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "numberOfSecuritiesNotScoredESG" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "numberOfSecuritiesScoredControversy" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "numberOfSecuritiesScoredESG" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "oilGasGenerationCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilGasGenerationInvolvement" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilGasProductionCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilGasProductionInvolvement" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilGasProductsServiceInvolvement" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilGasProductsServicesCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilSandsExtractionCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "oilSandsExtractionInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "percentAUMCoveredCarbon" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMCoveredControversy" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMCoveredESG" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMCoveredESGPillars" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithHighCarbonRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithHighControversies" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithHighESGRiskScores" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithLowCarbonRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithLowControveries" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithLowESGRiskScores" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithMediumCarbonRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithMediumESGRiskScores" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithModerateControversies" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithNULLESGRiskScores" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithNegligibleCarbonRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithNegligibleESGRiskScores" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithNoControversies" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithSevereCarbonRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithSevereControversies" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithSevereESGRiskScores" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "percentOfAUMWithSignificantControversies" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioCarbonIntensityVsBenchmark" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioCarbonRiskScoreVsBenchmark" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioDate" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "portfolioESGManagedRiskScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioESGRiskExposureScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioEmissionsVsBenchmarkScope1" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioEmissionsVsBenchmarkScope2" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioEnvironmentalScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioGovernanceScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioSocialScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "portfolioSustainabilityScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementAbortiveContraceptivesStemCell" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementAdultEntertainment" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementAlcohol" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementAnimalTesting" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgAbortiveContraceptivesStemCell" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgAdultEntertainment" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgAlcohol" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgAnimalTesting" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgControversialWeapons" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgFurSpecialtyLeather" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgGMO" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgGambling" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgMilitaryContracting" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgNuclear" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgPalmOil" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgPesticides" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgSmallArms" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgThermalCoal" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementCatAvgTobacco" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementControversialWeapons" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementFurSpecialtyLeather" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementGMO" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementGambling" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementMilitaryContracting" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementNuclear" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsAbortiveContraceptivesStemCell" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsAdultEntertainment" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsAlcohol" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsAnimalTesting" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsControversialWeapons" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsFurSpecialtyLeather" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsGMO" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsGambling" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsMilitaryContracting" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsNuclear" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsPalmOil" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsPesticides" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsSmallArms" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsThermalCoal" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementOfHoldingsTobacco" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementPalmOil" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementPesticides" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementSmallArms" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementThermalCoal" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "productInvolvementTobacco" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "renewableEnergyProductionCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "renewableEnergyProductionInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "renewableEnergySupportingProductsServicesCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "renewableEnergySupportingProductsServicesInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "socialGlobalCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "socialRiskAbsoluteRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "socialRiskPercentRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "socialRiskScoreVsGlobalCategory" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "strandedAssetsRisk" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "strandedAssetsRiskCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "strandedAssetsRiskPercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "sustainabilityAbsoluteRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "sustainabilityGlobalCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "sustainabilityPercentRankInGlobalCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "sustainabilityRatingDate" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentCommunityDevelopment" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentESGEngagement" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentESGFundOverall" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentESGIncorporation" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentEnvironmental" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentEnvironmentalSectorOverall" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentGenderDiversity" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentGeneralEnvironmentalSector" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentImpactFundOverall" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentLowCarbonFossilFuelFree" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentOtherImpactThemes" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentOverall" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentRenewableEnergy" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "sustainableInvestmentWaterFocused" : {
                            "type" : "keyword",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageBenchmarkCarbonRiskScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageBenchmarkFossilFuelInvolvement" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageCarbonRiskCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageCarbonRiskPercentRankInCategory" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageCarbonRiskScore" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageFossilFuelCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageFossilFuelExposure" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageHighestCarbonRiskScoreCategory" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageHighestFossilFuelInvolvementCategory" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageLowestCarbonRiskScoreCategory" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "the12MonthAverageLowestFossilFuelInvolvementCategory" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "thermalCoalExtractionCategoryAverage" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "thermalCoalExtractionInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        },
                        "thermalCoalPowerGenerationCategoryAverage" : {
                            "type" : "float",
                            "cql_collection" : "singleton"
                        },
                        "thermalCoalPowerGenerationInvolvement" : {
                            "type" : "long",
                            "cql_collection" : "singleton"
                        }
                    }
                },
                "isincode" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                },
                "ongoingcharge" : {
                    "type" : "float",
                    "cql_collection" : "singleton"
                },
                "productname" : {
                    "type" : "keyword",
                    "cql_collection" : "singleton"
                }
            }
        },
        "type" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        },
        "username" : {
            "type" : "keyword",
            "cql_collection" : "singleton"
        }
    };
    await client.indices.putMapping({ index, type, body: { properties: schema } });
    //await bulkindexService.getInstance().importExcel();
}

module.exports = {
    client, index, type, checkConnection, resetIndex
};