create temp table if not exists car_dump(
    anime text,
    song text,
    artist text,
    link text
);

insert into car_dump
select a.romaji, s.songname, s.artist, s.mp3
from amq_anime a
left join amq_songs s
on a.ann_id = s.anime_id
where a.romaji like '%Initial D%';

\t on
\pset format unaligned
select json_agg(t) from car_dump t \g car_dump.json
