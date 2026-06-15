using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Domin.BaseModel
{
    public class BaseDomin
    {
        public int Id {  get; set; }
        public string? Createdby { get; set; }
        public DateOnly? CreatedbyDate { get; set; }
        public string? Updatedby {  get; set; }
        public DateOnly? UpdatedbyDate { get; set; }
    }
}
