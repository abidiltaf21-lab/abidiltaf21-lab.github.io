using ReactApi.Domin.BaseModel;
using System;

namespace ReactApi.Domin.Commond_model
{
    public class SocialAccount : BaseDomin
    {
        public string Platform { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public bool IsVisible { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }
}
