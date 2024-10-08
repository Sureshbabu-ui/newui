using QuestPDF.Infrastructure;
using System;

namespace BeSureApi.Services
{
    public interface IPdfService
    {
        byte[] GeneratePdf(Action<IDocumentContainer> template);
    }
}