"use client"

import * as React from "react"
import Image from "next/image"
import AutoPlay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Jun Park",
    title: "Head of Design",
    company: "Radian Inc.",
    quote:
      "The Radian design system is a game-changer. It's streamlined our design process, improved collaboration, and significantly reduced development time. We're now delivering high-quality user experiences faster and more efficiently than ever before. Radian has truly transformed the way we work.",
    image: "https://dev.radianos.com/blocks/testimonial-1.png",
  },
  {
    id: 2,
    name: "Emily Carter",
    title: "Human Resource",
    company: "Radian Inc.",
    quote:
      "Since adopting the Radian design system, our team has gained clarity, speed, and alignment. Design and development now work in sync, and we're delivering polished, high-quality experiences with far less friction. It's been a huge upgrade to our process.",
    image: "https://dev.radianos.com/blocks/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Michael Reynolds",
    title: "Head of Product",
    company: "Radian Inc.",
    quote:
      "Radian has brought structure and efficiency to everything we do. Our design system is no longer a bottleneck, it's a force multiplier. We're building better products faster, and the results are clear in both our workflow and our user experience.",
    image: "https://dev.radianos.com/blocks/testimonial-3.jpg",
  },
]

export default function TestimonialCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }

    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
        containScroll: false,
      }}
      plugins={[Fade(), AutoPlay({ delay: 6000 })]}
      className="h-full w-full"
    >
      <CarouselContent className="ml-0 h-full">
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="h-svh p-6 pl-0">
            <div className="relative h-full overflow-hidden rounded-2xl">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
                sizes="50vw"
                priority={testimonial.id === 1}
              />
              <div className="absolute inset-x-0 bottom-0 flex w-full flex-col gap-6 rounded-b-2xl bg-gradient-to-t from-black/90 via-black/70 to-transparent p-12 text-white backdrop-blur-[2px]">
                <Quote className="size-5 rotate-180 fill-white text-white" />
                <p className="text-base font-medium leading-relaxed md:text-lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-xl font-semibold">{testimonial.name}</h4>
                  <div className="mt-1 flex flex-col gap-0.5">
                    <p className="text-sm font-semibold">{testimonial.company}</p>
                    <p className="text-sm text-white/70">{testimonial.title}</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-12 bottom-12 flex items-center gap-2">
                <CarouselPrevious
                  variant="ghost"
                  className="static translate-none rounded-md bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="size-4" />
                </CarouselPrevious>
                <div className="flex gap-2">
                  {testimonials.map((carousel, index) => (
                    <button
                      key={carousel.id}
                      type="button"
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "h-2 w-10 rounded-full transition-colors duration-300",
                        selectedIndex === index
                          ? "bg-white/80"
                          : "bg-white/30"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <CarouselNext
                  variant="ghost"
                  className="static translate-none rounded-md bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight className="size-4" />
                </CarouselNext>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
