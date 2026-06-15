using ReactApi.Domin.BaseModel;

namespace ReactApi.Domin.Commond_model
{
    public class Pricing : BaseDomin
    {
        public decimal BaseRate { get; set; } = 45;
        
        // Multipliers
        public decimal ComplexityBasic { get; set; } = 1;
        public decimal ComplexityMedium { get; set; } = 1.5m;
        public decimal ComplexityHigh { get; set; } = 2.2m;
        
        // Service Rates
        public decimal RateMotion { get; set; } = 100;
        public decimal RateExplainer { get; set; } = 150;
        public decimal RateProduction { get; set; } = 120;
        public decimal RateThreeD { get; set; } = 200;

        // Delivery Settings
        public int DeliveryDaysBasic { get; set; } = 2;
        public int DeliveryDaysMedium { get; set; } = 4;
        public int DeliveryDaysHigh { get; set; } = 7;
        public decimal UrgentMultiplier { get; set; } = 0.7m;
    }
}
