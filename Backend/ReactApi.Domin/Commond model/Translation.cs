using ReactApi.Domin.BaseModel;

namespace ReactApi.Domin.Commond_model
{
    public class Translation : BaseDomin
    {
        public required string LanguageCode { get; set; } // "en", "ps", "fa", "de", "fr", "ar"
        public required string Key { get; set; }          // e.g. "hero_title", "service_1_title"
        public required string Value { get; set; }        // The translated value
    }
}
