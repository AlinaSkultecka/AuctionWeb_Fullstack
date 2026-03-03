using AutoMapper;
using Lab3_v2_Backend.Core.DTOs;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Core.DTOs.Auction;
using Lab3_v2_Backend.Core.DTOs.Bid;
using Lab3_v2_Backend.Core.DTOs.User;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Lab3_v2_Backend.Core.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // -------------------- USER --------------------

            CreateMap<User, UserResponseDto>().ReverseMap();

            CreateMap<RegisterUserDto, User>();


            // -------------------- AUCTION --------------------

            CreateMap<Auction, AuctionResponseDto>().ReverseMap();

            CreateMap<CreateAuctionDto, Auction>();

            CreateMap<UpdateAuctionDto, Auction>();


            // -------------------- BID --------------------

            CreateMap<Bid, BidResponseDto>()
              .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User.UserName));


            CreateMap<CreateBidDto, Bid>();
        }
    }
}

