import Box from "@/components/reusables/Box";
import { sHeight } from "@/constants/dimensions.constant";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import ThemedButton from "@/components/reusables/ThemedButton";
import ThemedActivityIndicator from "@/components/reusables/ThemedActivityIndicator";
import { addMovieToWatchList, isInWatchList } from "@/valitio.store";
import { Platform, ScrollView } from "react-native";
import FilmHeader from "@/components/FilmHeader";
import { MovieResult } from "@/types/tmdb.types";
import useMovieDetail from "@/hooks/useMovieDetail.hook";
import ThemedListItem from "@/components/reusables/ThemedListItem";
import ThemedErrorCard from "@/components/reusables/ThemedErrorCard";
import ThemedText from "@/components/reusables/ThemedText";

export default function MovieDetails() {
  const { preview: previewString, id } = useLocalSearchParams<{
    preview: string;
    id: string;
  }>();

  const moviePreview = JSON.parse(previewString) as MovieResult;

  const { data: movie, isLoading, error } = useMovieDetail(id);

  const insets = useSafeAreaInsets();

  function addToWatchList() {
    if (!movie) return;
    addMovieToWatchList(movie);
    if (Platform.OS === "ios") {
      router.dismissTo("/(tabs)/watchlist");
    }
    router.replace("/(tabs)/watchlist");
  }

  return (
    <Box
      height={sHeight - insets.bottom - insets.top}
      justify="space-between"
      color={"background"}
      gap={10}
      position="relative"
    >
      <ScrollView>
        <Box>
          <FilmHeader preview={moviePreview} />

          {isLoading && <ThemedActivityIndicator />}

          {error && <ThemedErrorCard error={error.message} />}

          {movie && (
            <>
              <Box block>
                <ThemedListItem label="Overview" value={movie.overview} />
                <ThemedListItem
                  label="Rating"
                  value={movie.popularity.toString().slice(0, 3)}
                  varaint="horizontal"
                />
                <ThemedListItem
                  label="Released"
                  value={new Date(movie.release_date).toDateString()}
                  varaint="horizontal"
                />
                <ThemedListItem
                  label="Genres"
                  value={movie.genres.map((gen) => gen.name).join(", ")}
                  varaint="horizontal"
                />
              </Box>
            </>
          )}
          <ThemedText>
            Aute adipisicing minim enim amet esse ad nisi cillum occaecat magna
            sint. Amet adipisicing aliqua anim minim in aute do occaecat velit
            sit reprehenderit. Consequat irure labore duis nulla in cupidatat
            cupidatat labore laboris exercitation consectetur. Incididunt mollit
            ea ad veniam nostrud culpa duis nulla elit tempor laboris ad aute.
            Veniam cupidatat veniam mollit mollit nulla minim sint cillum
            laboris. Enim eiusmod qui in voluptate incididunt. Ut ad dolore
            commodo voluptate ut sunt ex anim do velit laborum. Aliqua quis duis
            amet excepteur amet cillum velit consequat. Consequat laboris duis
            sint minim do. Eu amet tempor dolore. Cupidatat sit do magna laborum
            incididunt commodo pariatur laboris culpa nulla veniam est anim
            dolor. Non dolor enim anim. Fugiat voluptate voluptate qui duis duis
            non ad sunt ullamco eiusmod culpa. Ipsum reprehenderit mollit id id
            deserunt aute exercitation et exercitation nisi sunt amet
            reprehenderit veniam cupidatat. Ea nulla aliquip laborum voluptate
            cupidatat ipsum consequat consequat eu exercitation. Magna cillum
            labore exercitation elit culpa et anim occaecat enim adipisicing.
            Enim ea aute enim occaecat officia reprehenderit est amet
            incididunt. Officia consequat sunt exercitation qui irure Lorem
            commodo tempor do eu incididunt do occaecat quis. Aute fugiat veniam
            in et ipsum consequat est do in est fugiat qui. Aute et occaecat
            culpa et nulla in nisi. Commodo Lorem tempor non aute. Nulla anim in
            officia non ipsum enim sit eiusmod velit sint. Aute magna Lorem
            magna adipisicing. Quis est qui occaecat minim excepteur duis
            commodo. Consectetur amet aliquip proident pariatur officia laborum
            et Lorem qui proident in elit deserunt aute laboris. Irure eu
            cupidatat mollit deserunt quis magna ipsum esse esse non sunt
            consequat consectetur. Irure cillum nulla aliqua nisi ex eiusmod
            quis cillum reprehenderit amet. Qui ex irure aliqua anim consectetur
            in nulla irure. Exercitation ad et eiusmod consequat ut officia et
            pariatur laboris est quis ex sunt duis ipsum. Proident deserunt
            nostrud et anim quis et officia mollit culpa nostrud cillum. Ea
            proident laboris laborum incididunt cupidatat anim magna Lorem
            incididunt incididunt officia eu qui duis do. Non pariatur dolore
            amet amet labore nostrud aute reprehenderit sint exercitation cillum
            ea tempor. Occaecat tempor irure ullamco qui consequat quis quis do
            eiusmod ullamco aliqua consectetur proident sunt. Mollit pariatur
            consectetur aute exercitation non anim pariatur et eiusmod velit
            pariatur duis aute. Quis adipisicing pariatur exercitation duis aute
            in fugiat est eiusmod. Enim irure esse reprehenderit pariatur
            proident labore esse occaecat culpa non. Enim fugiat irure irure
            officia veniam qui reprehenderit quis ex laboris officia id.
            Consequat aliqua exercitation non est cupidatat ut. Irure et
            reprehenderit amet pariatur duis cillum exercitation ex eu officia
            deserunt id commodo labore sint. Nisi qui ea ex aute minim Lorem
            quis irure ipsum ullamco elit velit. Amet officia eiusmod aliquip
            sunt sunt incididunt cupidatat irure exercitation laboris qui
            adipisicing. Excepteur amet magna mollit laborum. Consequat id nulla
            commodo cupidatat aliquip sunt sit voluptate minim ex. Labore
            reprehenderit eu consectetur. Ex reprehenderit elit tempor nostrud
            ut tempor esse elit occaecat nostrud pariatur incididunt consequat
            consequat. Do irure sunt amet aute aliquip sunt commodo ut ut
            adipisicing consectetur. Amet qui sit qui est in ullamco eiusmod
            reprehenderit in aliquip ea dolore excepteur dolore. Esse
            reprehenderit occaecat culpa nisi. Pariatur nulla est do
            reprehenderit culpa ea sint tempor est quis. Ut cillum dolore
            laboris anim et labore aliqua laboris labore dolore ullamco laborum
            irure aute velit. Culpa quis nulla incididunt deserunt Lorem sint
            consequat. Laborum consequat sunt adipisicing magna labore deserunt
            nostrud culpa dolore ut magna cillum tempor. Esse est reprehenderit
            ullamco Lorem reprehenderit nostrud commodo et tempor nisi eu.
            Adipisicing sit dolor irure id ad anim consequat officia magna dolor
            consectetur minim. Irure id adipisicing sit laborum veniam
            reprehenderit proident laboris culpa. Veniam non enim mollit fugiat
            dolor aute aute eiusmod aliquip cillum id pariatur. Ullamco anim
            elit mollit reprehenderit Lorem in ea dolore laborum exercitation
            ipsum pariatur quis duis. Deserunt labore tempor enim duis nisi
            nulla. Eu aliqua irure commodo aliqua. Tempor tempor magna dolore.
            Consectetur quis quis qui esse commodo elit duis eiusmod. Id sit
            duis ut minim. Excepteur tempor proident laborum ea excepteur
            officia aute eiusmod aute aute sit occaecat aliqua. Cupidatat
            laboris ullamco deserunt irure aliqua elit irure nisi ipsum deserunt
            proident laborum voluptate laborum. Quis incididunt cillum aliquip
            amet exercitation. Id cillum sint sunt sint irure. Exercitation
            fugiat mollit adipisicing sint sunt occaecat amet nostrud laboris
            reprehenderit esse. Culpa proident officia deserunt cupidatat
            cupidatat. Esse Lorem laborum cillum occaecat aliquip irure do ea
            sit proident nisi ipsum irure. Sint id in sint minim do mollit enim
            anim duis. Cillum Lorem excepteur excepteur deserunt sint aute
            aliquip consectetur et et adipisicing occaecat. Deserunt sint
            incididunt magna officia tempor amet proident. Magna minim
            consectetur laborum eiusmod commodo occaecat non enim occaecat.
            Consectetur non enim ullamco elit anim consectetur id id esse
            consectetur excepteur ad. Labore ut eu sit eiusmod sunt veniam id
            aute. Aute eu dolor adipisicing nisi irure ad commodo consequat do
            laboris eu veniam. Do cupidatat do irure ut occaecat enim. Nulla
            velit enim aliqua aliqua duis cupidatat eiusmod minim amet proident
            fugiat sit. Exercitation adipisicing officia do sint dolor. Ipsum et
            cillum nostrud magna quis et aliqua commodo sint non. Magna
            excepteur nisi proident quis nisi Lorem culpa do excepteur ex. Sint
            deserunt laboris fugiat anim consequat enim. Velit magna voluptate
            nulla. Anim commodo deserunt veniam duis duis. Do consequat dolore
            est pariatur nulla cupidatat Lorem sunt non eu. Culpa esse quis
            veniam ullamco reprehenderit officia eiusmod culpa dolor eu. Et
            consequat ea enim excepteur dolor deserunt consectetur ea nostrud
            officia aute qui et. Sit duis aute quis deserunt exercitation culpa
            velit deserunt ex proident minim minim ex consequat nulla. Deserunt
            cillum excepteur ipsum irure mollit non amet sit minim. Ut ea ex
            irure laboris anim nisi dolore et ex amet labore exercitation nulla
            dolore. Consequat aliquip eiusmod culpa irure sunt laboris duis
            Lorem quis ullamco. Ea Lorem occaecat officia ea qui. Exercitation
            consequat ullamco sint. Qui laborum veniam labore elit id veniam
            aliquip aliquip dolor tempor. Magna id deserunt dolor dolor
            incididunt. Quis duis esse labore in in est esse sunt Lorem deserunt
            mollit. Lorem nisi labore deserunt do aliquip minim. Exercitation
            officia enim dolor nostrud laboris id sint ullamco esse Lorem tempor
            exercitation cupidatat. Consectetur qui aliquip consequat. Culpa
            aliqua cillum deserunt officia commodo nisi dolor sunt velit dolore
            dolor. Sit nostrud anim fugiat et laborum qui ullamco laboris sint
            adipisicing irure nostrud enim eiusmod deserunt. Sunt non sunt
            velit. Ad consequat velit enim eu aliqua enim nulla consectetur
            tempor veniam eu proident qui. Magna cillum pariatur consequat sint
            aliquip qui sint sint sunt excepteur. Cupidatat ex in do aliqua
            proident nostrud. Et aute exercitation quis dolore anim quis culpa
            ea duis consectetur culpa reprehenderit. Eu ut officia Lorem. Eu
            duis non occaecat aliquip proident pariatur voluptate dolore. Duis
            anim voluptate labore. Laborum duis velit in velit ex Lorem quis
            tempor qui. Aliquip irure sunt nostrud aute ipsum laboris. Amet
            veniam fugiat ad laboris voluptate nulla officia pariatur id dolor
            officia proident. Lorem ad aute incididunt cupidatat magna. Proident
            ea excepteur qui laborum occaecat nulla sunt deserunt non voluptate
            sit adipisicing. In veniam non deserunt ullamco. Reprehenderit enim
            aliquip aute laborum. Fugiat elit incididunt sint esse eu enim. Qui
            magna aliqua pariatur amet deserunt. Aute elit cupidatat ullamco
            excepteur est qui sint cupidatat do. Enim duis ex ipsum laboris
            proident Lorem mollit sunt eu pariatur. Consectetur duis aliquip in
            adipisicing eu ex mollit eu deserunt quis ex dolor exercitation
            cupidatat irure. Aute voluptate mollit labore pariatur tempor quis
            veniam sit incididunt irure eu culpa cillum aute. Tempor nostrud
            aliquip veniam adipisicing aute eu culpa in incididunt. Quis
            consectetur commodo aute amet cillum proident anim. Culpa elit amet
            duis ut voluptate sunt voluptate in aliqua labore aliqua consectetur
            aliquip. Elit nulla culpa cillum consectetur adipisicing. Magna qui
            consectetur pariatur reprehenderit. Do cupidatat eu sit proident
            ipsum labore ullamco sit. Magna aliquip dolor laborum esse
            incididunt qui ea. Id adipisicing consequat laboris labore aliqua
            fugiat commodo tempor pariatur nisi id mollit laboris Lorem. Ea sunt
            sit consectetur Lorem quis anim incididunt aute minim quis cupidatat
            dolor dolore mollit cupidatat. Magna irure deserunt cupidatat
            eiusmod tempor ex ex eiusmod in.
          </ThemedText>
        </Box>
      </ScrollView>
      {movie && (
        <Box gap={20} direction="row" px={20}>
          <ThemedButton
            label={isInWatchList(movie.id) ? "Watching Later" : "Watch Later"}
            type={isInWatchList(movie.id) ? "surface" : "primary"}
            direction="column"
            size="sm"
            py={15}
            onPress={addToWatchList}
            block
          />
        </Box>
      )}
    </Box>
  );
}
